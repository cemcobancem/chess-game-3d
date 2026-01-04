import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChessBoard3D from '@/components/chess/ChessBoard3D';
import GameControls from '@/components/chess/GameControls';
import GameStatus from '@/components/chess/GameStatus';
import MoveHistory from '@/components/chess/MoveHistory';
import PawnPromotion from '@/components/chess/PawnPromotion';
import PieceCustomization from '@/components/chess/PieceCustomization';
import CapturedPieces from '@/components/chess/CapturedPieces';
import {
  createInitialBoard,
  cloneBoard,
  getValidMoves,
  getAllMoves,
  getGameStatus,
  getBestMove,
  isKingInCheck,
  PIECES,
  COLORS
} from '@/components/chess/ChessEngine';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Maximize2, Minimize2, RotateCcw, Settings } from "lucide-react";

const initialGameState = {
  whiteCastle: { kingSide: true, queenSide: true },
  blackCastle: { kingSide: true, queenSide: true },
  enPassantTarget: null
};

export default function ChessPage() {
  const [board, setBoard] = useState(createInitialBoard);
  const [gameState, setGameState] = useState(initialGameState);
  const [currentTurn, setCurrentTurn] = useState(COLORS.WHITE);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [difficulty, setDifficulty] = useState(5);
  const [gameStatus, setGameStatus] = useState({ status: 'playing', winner: null });
  const [isThinking, setIsThinking] = useState(false);
  const [showPromotion, setShowPromotion] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [boardHistory, setBoardHistory] = useState([]);
  const [pieceMaterial, setPieceMaterial] = useState('wood');
  const [pieceStyle, setPieceStyle] = useState('classic');
  const [boardType, setBoardType] = useState('classic');
  const [capturedPieces, setCapturedPieces] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const playerColor = COLORS.WHITE;
  const aiColor = COLORS.BLACK;

  // Load saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('chessGame');
    if (savedGame) {
      try {
        const data = JSON.parse(savedGame);
        setBoard(data.board);
        setGameState(data.gameState);
        setCurrentTurn(data.currentTurn);
        setMoveHistory(data.moveHistory || []);
        setLastMove(data.lastMove || null);
        setCapturedPieces(data.capturedPieces || []);
        setBoardHistory(data.boardHistory || []);
        setDifficulty(data.difficulty || 5);
        setPieceMaterial(data.pieceMaterial || 'wood');
        setPieceStyle(data.pieceStyle || 'classic');
        setBoardType(data.boardType || 'classic');
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    const gameData = {
      board,
      gameState,
      currentTurn,
      moveHistory,
      lastMove,
      capturedPieces,
      boardHistory,
      difficulty,
      pieceMaterial,
      pieceStyle,
      boardType
    };
    localStorage.setItem('chessGame', JSON.stringify(gameData));
  }, [board, gameState, currentTurn, moveHistory, lastMove, capturedPieces, boardHistory, difficulty, pieceMaterial, pieceStyle, boardType]);

  // Check game status after each move
  useEffect(() => {
    const status = getGameStatus(board, currentTurn, gameState);
    setGameStatus(status);
  }, [board, currentTurn, gameState]);

  // AI move
  useEffect(() => {
    if (currentTurn === aiColor && gameStatus.status === 'playing') {
      setIsThinking(true);
      
      // Use setTimeout to allow UI to update before AI calculation
      const timeoutId = setTimeout(() => {
        const aiMove = getBestMove(board, aiColor, gameState, difficulty);
        
        if (aiMove) {
          makeMove(aiMove.fromRow, aiMove.fromCol, aiMove.toRow, aiMove.toCol, aiMove);
        }
        setIsThinking(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentTurn, gameStatus.status, aiColor]);

  const makeMove = useCallback((fromRow, fromCol, toRow, toCol, moveInfo = {}) => {
    const piece = board[fromRow][fromCol];
    if (!piece) return;

    // Save board state for undo
    setBoardHistory(prev => [...prev, { board: cloneBoard(board), gameState: { ...gameState }, turn: currentTurn, captured: capturedPieces }]);

    const newBoard = cloneBoard(board);
    const newGameState = { ...gameState };
    
    // Track captured piece
    let captured = newBoard[toRow][toCol];
    
    // Add to captured pieces if there was a capture
    if (captured) {
      setCapturedPieces(prev => [...prev, captured]);
    }

    // Handle castling
    if (moveInfo.castle) {
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
      newBoard[fromRow][fromCol] = null;
      
      if (moveInfo.castle === 'kingside') {
        newBoard[toRow][5] = newBoard[toRow][7];
        newBoard[toRow][7] = null;
      } else {
        newBoard[toRow][3] = newBoard[toRow][0];
        newBoard[toRow][0] = null;
      }
    }
    // Handle en passant
    else if (moveInfo.enPassant) {
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
      newBoard[fromRow][fromCol] = null;
      captured = newBoard[fromRow][toCol];
      if (captured) {
        setCapturedPieces(prev => [...prev, captured]);
      }
      newBoard[fromRow][toCol] = null;
    }
    // Normal move
    else {
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
      newBoard[fromRow][fromCol] = null;
    }

    // Handle pawn promotion
    const isPromotion = piece.type === PIECES.PAWN && (toRow === 0 || toRow === 7);
    if (isPromotion && !moveInfo.promotion) {
      // If it's player's pawn, show promotion dialog
      if (piece.color === playerColor) {
        setShowPromotion({
          toRow, toCol, fromRow, fromCol, color: piece.color,
          board: newBoard, gameState: newGameState, captured
        });
        return;
      } else {
        // AI always promotes to queen
        moveInfo.promotion = PIECES.QUEEN;
      }
    }

    if (moveInfo.promotion) {
      newBoard[toRow][toCol] = { type: moveInfo.promotion, color: piece.color };
    }

    // Update castling rights
    if (piece.type === PIECES.KING) {
      if (piece.color === COLORS.WHITE) {
        newGameState.whiteCastle = { kingSide: false, queenSide: false };
      } else {
        newGameState.blackCastle = { kingSide: false, queenSide: false };
      }
    }
    if (piece.type === PIECES.ROOK) {
      if (piece.color === COLORS.WHITE) {
        if (fromCol === 0) newGameState.whiteCastle.queenSide = false;
        if (fromCol === 7) newGameState.whiteCastle.kingSide = false;
      } else {
        if (fromCol === 0) newGameState.blackCastle.queenSide = false;
        if (fromCol === 7) newGameState.blackCastle.kingSide = false;
      }
    }

    // Update en passant target
    if (piece.type === PIECES.PAWN && Math.abs(toRow - fromRow) === 2) {
      newGameState.enPassantTarget = {
        row: (fromRow + toRow) / 2,
        col: toCol
      };
    } else {
      newGameState.enPassantTarget = null;
    }

    // Check if opponent is in check/checkmate
    const opponentColor = piece.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    const inCheck = isKingInCheck(newBoard, opponentColor);
    const status = getGameStatus(newBoard, opponentColor, newGameState);

    // Record move
    const move = {
      fromRow, fromCol, toRow, toCol,
      pieceType: piece.type,
      color: piece.color,
      captured: captured?.type,
      castle: moveInfo.castle,
      enPassant: moveInfo.enPassant,
      promotion: moveInfo.promotion,
      check: inCheck && status.status !== 'checkmate',
      checkmate: status.status === 'checkmate'
    };

    setBoard(newBoard);
    setGameState(newGameState);
    setCurrentTurn(opponentColor);
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove({ fromRow, fromCol, toRow, toCol });
    setMoveHistory(prev => [...prev, move]);
  }, [board, gameState, playerColor, capturedPieces]);

  const handlePromotion = useCallback((pieceType) => {
    if (!showPromotion) return;
    
    const { toRow, toCol, fromRow, fromCol, board: newBoard, gameState: newGameState, captured, color } = showPromotion;
    
    newBoard[toRow][toCol] = { type: pieceType, color };
    
    const opponentColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    const inCheck = isKingInCheck(newBoard, opponentColor);
    const status = getGameStatus(newBoard, opponentColor, newGameState);

    const move = {
      fromRow, fromCol, toRow, toCol,
      pieceType: PIECES.PAWN,
      color,
      captured: captured?.type,
      promotion: pieceType,
      check: inCheck && status.status !== 'checkmate',
      checkmate: status.status === 'checkmate'
    };

    setBoard(newBoard);
    setGameState(newGameState);
    setCurrentTurn(opponentColor);
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove({ fromRow, fromCol, toRow, toCol });
    setMoveHistory(prev => [...prev, move]);
    setShowPromotion(null);
  }, [showPromotion]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus.status === 'checkmate' || gameStatus.status === 'stalemate') return;
    if (currentTurn !== playerColor) return;

    const clickedPiece = board[row][col];

    // If we have a selected piece and clicked on a valid move
    if (selectedSquare) {
      const move = validMoves.find(m => m.toRow === row && m.toCol === col);
      if (move) {
        makeMove(selectedSquare.row, selectedSquare.col, row, col, move);
        return;
      }
    }

    // Select a new piece
    if (clickedPiece && clickedPiece.color === playerColor) {
      setSelectedSquare({ row, col });
      const moves = getValidMoves(board, row, col, gameState);
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [board, selectedSquare, validMoves, currentTurn, playerColor, gameState, gameStatus, makeMove]);

  const handleNewGame = useCallback(() => {
    setBoard(createInitialBoard());
    setGameState(initialGameState);
    setCurrentTurn(COLORS.WHITE);
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setLastMove(null);
    setGameStatus({ status: 'playing', winner: null });
    setBoardHistory([]);
    setCapturedPieces([]);
    localStorage.removeItem('chessGame');
  }, []);

  const handleUndo = useCallback(() => {
    // Undo both player and AI moves
    if (boardHistory.length >= 2) {
      const prevState = boardHistory[boardHistory.length - 2];
      setBoard(prevState.board);
      setGameState(prevState.gameState);
      setCurrentTurn(prevState.turn);
      setCapturedPieces(prevState.captured || []);
      setBoardHistory(prev => prev.slice(0, -2));
      setMoveHistory(prev => prev.slice(0, -2));
      setSelectedSquare(null);
      setValidMoves([]);
      setLastMove(null);
      setGameStatus({ status: 'playing', winner: null });
    }
  }, [boardHistory]);

  const handleResign = useCallback(() => {
    setGameStatus({ status: 'checkmate', winner: aiColor });
  }, [aiColor]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-2xl">♔</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">3D Chess</h1>
              <p className="text-white/40 text-xs">Challenge the AI</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-2 py-4">
        <div className="flex flex-col items-center gap-4">
          {/* Settings Button */}
          <div className="self-end">
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button 
                  size="icon"
                  className="bg-gray-900/95 border-white/10 text-white hover:bg-white/10 shadow-2xl backdrop-blur"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[450px] bg-gradient-to-br from-gray-950 to-gray-900 border-white/10 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-white text-xl">Game Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <GameControls
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    onNewGame={handleNewGame}
                    onUndo={handleUndo}
                    onResign={handleResign}
                    canUndo={boardHistory.length >= 2}
                    gameOver={gameStatus.status === 'checkmate' || gameStatus.status === 'stalemate'}
                  />

                  <PieceCustomization
                    material={pieceMaterial}
                    style={pieceStyle}
                    boardType={boardType}
                    onMaterialChange={setPieceMaterial}
                    onStyleChange={setPieceStyle}
                    onBoardTypeChange={setBoardType}
                  />

                  <div className="h-[200px]">
                    <MoveHistory moves={moveHistory} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Chess Board */}
          <div className="w-full max-w-[900px] aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10">
            <ChessBoard3D
              board={board}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              lastMove={lastMove}
              isThinking={isThinking}
              material={pieceMaterial}
              style={pieceStyle}
              boardType={boardType}
            />
          </div>
          
          {/* Game Info Below Board */}
          <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <CapturedPieces 
              capturedPieces={capturedPieces} 
              color={COLORS.WHITE}
              label="Captured White"
            />
            <GameStatus
              currentTurn={currentTurn}
              gameStatus={gameStatus}
              playerColor={playerColor}
            />
            <CapturedPieces 
              capturedPieces={capturedPieces} 
              color={COLORS.BLACK}
              label="Captured Black"
            />
          </div>
        </div>
      </main>

      {/* Pawn Promotion Modal */}
      <PawnPromotion
        show={showPromotion !== null}
        color={showPromotion?.color}
        onSelect={handlePromotion}
      />

      {/* Game Over Overlay */}
      <AnimatePresence>
        {(gameStatus.status === 'checkmate' || gameStatus.status === 'stalemate') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4"
            onClick={handleNewGame}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-white/10 text-center max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              {gameStatus.status === 'checkmate' ? (
                <>
                  <div className="text-6xl mb-4">
                    {gameStatus.winner === playerColor ? '🏆' : '💔'}
                  </div>
                  <h2 className="text-white text-2xl font-bold mb-2">
                    {gameStatus.winner === playerColor ? 'Victory!' : 'Defeat'}
                  </h2>
                  <p className="text-white/60 mb-6">
                    {gameStatus.winner === playerColor 
                      ? 'Congratulations! You defeated the AI!'
                      : 'The AI has won this time. Try again!'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🤝</div>
                  <h2 className="text-white text-2xl font-bold mb-2">Stalemate</h2>
                  <p className="text-white/60 mb-6">The game is a draw!</p>
                </>
              )}
              
              <Button
                onClick={handleNewGame}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg"
              >
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}