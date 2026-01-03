import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { PIECES, COLORS, toAlgebraic } from './ChessEngine';

const PIECE_SYMBOLS = {
  [PIECES.KING]: '♔',
  [PIECES.QUEEN]: '♕',
  [PIECES.ROOK]: '♖',
  [PIECES.BISHOP]: '♗',
  [PIECES.KNIGHT]: '♘',
  [PIECES.PAWN]: ''
};

const PIECE_SYMBOLS_BLACK = {
  [PIECES.KING]: '♚',
  [PIECES.QUEEN]: '♛',
  [PIECES.ROOK]: '♜',
  [PIECES.BISHOP]: '♝',
  [PIECES.KNIGHT]: '♞',
  [PIECES.PAWN]: ''
};

export default function MoveHistory({ moves }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const formatMove = (move) => {
    const symbols = move.color === COLORS.WHITE ? PIECE_SYMBOLS : PIECE_SYMBOLS_BLACK;
    const piece = symbols[move.pieceType] || '';
    const from = toAlgebraic(move.fromRow, move.fromCol);
    const to = toAlgebraic(move.toRow, move.toCol);
    const capture = move.captured ? 'x' : '-';
    
    let notation = `${piece}${from}${capture}${to}`;
    
    if (move.castle === 'kingside') notation = 'O-O';
    if (move.castle === 'queenside') notation = 'O-O-O';
    if (move.promotion) notation += `=${PIECE_SYMBOLS[move.promotion]}`;
    if (move.check) notation += '+';
    if (move.checkmate) notation += '#';
    
    return notation;
  };

  // Group moves into pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-purple-400" />
        <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">Move History</h3>
        <span className="ml-auto text-white/40 text-xs">{moves.length} moves</span>
      </div>
      
      <ScrollArea className="flex-1 pr-3" ref={scrollRef}>
        {moves.length === 0 ? (
          <div className="text-white/30 text-center py-8 text-sm">
            No moves yet. You play as White - make your move!
          </div>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-[2rem_1fr_1fr] gap-2 p-2 rounded-lg transition-colors ${
                  idx === movePairs.length - 1 ? 'bg-purple-500/20' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-white/30 text-sm font-mono">{pair.number}.</span>
                <span className={`text-sm font-mono ${pair.white ? 'text-white' : 'text-white/30'}`}>
                  {pair.white ? formatMove(pair.white) : '...'}
                </span>
                <span className={`text-sm font-mono ${pair.black ? 'text-white/70' : 'text-white/30'}`}>
                  {pair.black ? formatMove(pair.black) : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}