// Chess Engine - Full game logic with AI
const PIECES = {
  KING: 'k', QUEEN: 'q', ROOK: 'r', BISHOP: 'b', KNIGHT: 'n', PAWN: 'p'
};

const COLORS = { WHITE: 'w', BLACK: 'b' };

// Piece values for AI evaluation
const PIECE_VALUES = {
  [PIECES.PAWN]: 100,
  [PIECES.KNIGHT]: 320,
  [PIECES.BISHOP]: 330,
  [PIECES.ROOK]: 500,
  [PIECES.QUEEN]: 900,
  [PIECES.KING]: 20000
};

// Position bonus tables for better AI play
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const POSITION_TABLES = {
  [PIECES.PAWN]: PAWN_TABLE,
  [PIECES.KNIGHT]: KNIGHT_TABLE,
  [PIECES.BISHOP]: BISHOP_TABLE,
  [PIECES.ROOK]: ROOK_TABLE,
  [PIECES.QUEEN]: QUEEN_TABLE,
  [PIECES.KING]: KING_TABLE
};

// Initialize standard chess board
export function createInitialBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Black pieces (top)
  board[0] = [
    { type: PIECES.ROOK, color: COLORS.BLACK },
    { type: PIECES.KNIGHT, color: COLORS.BLACK },
    { type: PIECES.BISHOP, color: COLORS.BLACK },
    { type: PIECES.QUEEN, color: COLORS.BLACK },
    { type: PIECES.KING, color: COLORS.BLACK },
    { type: PIECES.BISHOP, color: COLORS.BLACK },
    { type: PIECES.KNIGHT, color: COLORS.BLACK },
    { type: PIECES.ROOK, color: COLORS.BLACK }
  ];
  board[1] = Array(8).fill(null).map(() => ({ type: PIECES.PAWN, color: COLORS.BLACK }));
  
  // White pieces (bottom)
  board[6] = Array(8).fill(null).map(() => ({ type: PIECES.PAWN, color: COLORS.WHITE }));
  board[7] = [
    { type: PIECES.ROOK, color: COLORS.WHITE },
    { type: PIECES.KNIGHT, color: COLORS.WHITE },
    { type: PIECES.BISHOP, color: COLORS.WHITE },
    { type: PIECES.QUEEN, color: COLORS.WHITE },
    { type: PIECES.KING, color: COLORS.WHITE },
    { type: PIECES.BISHOP, color: COLORS.WHITE },
    { type: PIECES.KNIGHT, color: COLORS.WHITE },
    { type: PIECES.ROOK, color: COLORS.WHITE }
  ];
  
  return board;
}

// Deep clone board
export function cloneBoard(board) {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

// Check if position is on board
function isOnBoard(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get all valid moves for a piece
export function getValidMoves(board, row, col, gameState) {
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves = [];
  const { type, color } = piece;
  
  switch (type) {
    case PIECES.PAWN:
      moves.push(...getPawnMoves(board, row, col, color, gameState));
      break;
    case PIECES.KNIGHT:
      moves.push(...getKnightMoves(board, row, col, color));
      break;
    case PIECES.BISHOP:
      moves.push(...getSlidingMoves(board, row, col, color, [[1,1], [1,-1], [-1,1], [-1,-1]]));
      break;
    case PIECES.ROOK:
      moves.push(...getSlidingMoves(board, row, col, color, [[0,1], [0,-1], [1,0], [-1,0]]));
      break;
    case PIECES.QUEEN:
      moves.push(...getSlidingMoves(board, row, col, color, [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]));
      break;
    case PIECES.KING:
      moves.push(...getKingMoves(board, row, col, color, gameState));
      break;
  }
  
  // Filter out moves that leave king in check
  return moves.filter(move => {
    const testBoard = cloneBoard(board);
    testBoard[move.toRow][move.toCol] = testBoard[row][col];
    testBoard[row][col] = null;
    
    // Handle en passant capture
    if (move.enPassant) {
      testBoard[row][move.toCol] = null;
    }
    
    return !isKingInCheck(testBoard, color);
  });
}

function getPawnMoves(board, row, col, color, gameState) {
  const moves = [];
  const direction = color === COLORS.WHITE ? -1 : 1;
  const startRow = color === COLORS.WHITE ? 6 : 1;
  
  // Forward move
  if (isOnBoard(row + direction, col) && !board[row + direction][col]) {
    moves.push({ toRow: row + direction, toCol: col });
    
    // Double move from start
    if (row === startRow && !board[row + 2 * direction][col]) {
      moves.push({ toRow: row + 2 * direction, toCol: col, doublePawn: true });
    }
  }
  
  // Captures
  for (const dc of [-1, 1]) {
    const newRow = row + direction;
    const newCol = col + dc;
    if (isOnBoard(newRow, newCol)) {
      const target = board[newRow][newCol];
      if (target && target.color !== color) {
        moves.push({ toRow: newRow, toCol: newCol });
      }
      
      // En passant
      if (gameState.enPassantTarget && 
          gameState.enPassantTarget.row === newRow && 
          gameState.enPassantTarget.col === newCol) {
        moves.push({ toRow: newRow, toCol: newCol, enPassant: true });
      }
    }
  }
  
  return moves;
}

function getKnightMoves(board, row, col, color) {
  const moves = [];
  const offsets = [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]];
  
  for (const [dr, dc] of offsets) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isOnBoard(newRow, newCol)) {
      const target = board[newRow][newCol];
      if (!target || target.color !== color) {
        moves.push({ toRow: newRow, toCol: newCol });
      }
    }
  }
  
  return moves;
}

function getSlidingMoves(board, row, col, color, directions) {
  const moves = [];
  
  for (const [dr, dc] of directions) {
    let newRow = row + dr;
    let newCol = col + dc;
    
    while (isOnBoard(newRow, newCol)) {
      const target = board[newRow][newCol];
      if (!target) {
        moves.push({ toRow: newRow, toCol: newCol });
      } else {
        if (target.color !== color) {
          moves.push({ toRow: newRow, toCol: newCol });
        }
        break;
      }
      newRow += dr;
      newCol += dc;
    }
  }
  
  return moves;
}

function getKingMoves(board, row, col, color, gameState) {
  const moves = [];
  const offsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
  
  for (const [dr, dc] of offsets) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isOnBoard(newRow, newCol)) {
      const target = board[newRow][newCol];
      if (!target || target.color !== color) {
        moves.push({ toRow: newRow, toCol: newCol });
      }
    }
  }
  
  // Castling
  const castleRights = color === COLORS.WHITE ? gameState.whiteCastle : gameState.blackCastle;
  if (!isKingInCheck(board, color)) {
    // Kingside
    if (castleRights.kingSide && !board[row][5] && !board[row][6]) {
      if (!isSquareAttacked(board, row, 5, color) && !isSquareAttacked(board, row, 6, color)) {
        moves.push({ toRow: row, toCol: 6, castle: 'kingside' });
      }
    }
    // Queenside
    if (castleRights.queenSide && !board[row][1] && !board[row][2] && !board[row][3]) {
      if (!isSquareAttacked(board, row, 2, color) && !isSquareAttacked(board, row, 3, color)) {
        moves.push({ toRow: row, toCol: 2, castle: 'queenside' });
      }
    }
  }
  
  return moves;
}

// Check if a square is attacked by opponent
function isSquareAttacked(board, row, col, defendingColor) {
  const attackingColor = defendingColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  
  // Check for pawn attacks
  const pawnDir = defendingColor === COLORS.WHITE ? -1 : 1;
  for (const dc of [-1, 1]) {
    const pr = row + pawnDir;
    const pc = col + dc;
    if (isOnBoard(pr, pc)) {
      const piece = board[pr][pc];
      if (piece && piece.type === PIECES.PAWN && piece.color === attackingColor) {
        return true;
      }
    }
  }
  
  // Check for knight attacks
  const knightOffsets = [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]];
  for (const [dr, dc] of knightOffsets) {
    const nr = row + dr;
    const nc = col + dc;
    if (isOnBoard(nr, nc)) {
      const piece = board[nr][nc];
      if (piece && piece.type === PIECES.KNIGHT && piece.color === attackingColor) {
        return true;
      }
    }
  }
  
  // Check for king attacks
  const kingOffsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
  for (const [dr, dc] of kingOffsets) {
    const kr = row + dr;
    const kc = col + dc;
    if (isOnBoard(kr, kc)) {
      const piece = board[kr][kc];
      if (piece && piece.type === PIECES.KING && piece.color === attackingColor) {
        return true;
      }
    }
  }
  
  // Check for sliding piece attacks (rook, bishop, queen)
  const directions = {
    straight: [[0,1], [0,-1], [1,0], [-1,0]],
    diagonal: [[1,1], [1,-1], [-1,1], [-1,-1]]
  };
  
  for (const [dr, dc] of directions.straight) {
    let r = row + dr;
    let c = col + dc;
    while (isOnBoard(r, c)) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === attackingColor && (piece.type === PIECES.ROOK || piece.type === PIECES.QUEEN)) {
          return true;
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  
  for (const [dr, dc] of directions.diagonal) {
    let r = row + dr;
    let c = col + dc;
    while (isOnBoard(r, c)) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === attackingColor && (piece.type === PIECES.BISHOP || piece.type === PIECES.QUEEN)) {
          return true;
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  
  return false;
}

// Find king position
function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PIECES.KING && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

// Check if king is in check
export function isKingInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos.row, kingPos.col, color);
}

// Get all moves for a color
export function getAllMoves(board, color, gameState) {
  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const pieceMoves = getValidMoves(board, row, col, gameState);
        for (const move of pieceMoves) {
          moves.push({ fromRow: row, fromCol: col, ...move });
        }
      }
    }
  }
  return moves;
}

// Check for checkmate or stalemate
export function getGameStatus(board, currentTurn, gameState) {
  const moves = getAllMoves(board, currentTurn, gameState);
  const inCheck = isKingInCheck(board, currentTurn);
  
  if (moves.length === 0) {
    if (inCheck) {
      return { status: 'checkmate', winner: currentTurn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE };
    } else {
      return { status: 'stalemate', winner: null };
    }
  }
  
  if (inCheck) {
    return { status: 'check', winner: null };
  }
  
  return { status: 'playing', winner: null };
}

// Evaluate board position for AI
export function evaluateBoard(board, color) {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = PIECE_VALUES[piece.type];
        const posTable = POSITION_TABLES[piece.type];
        const posIndex = piece.color === COLORS.WHITE ? row * 8 + col : (7 - row) * 8 + col;
        const posValue = posTable[posIndex];
        
        if (piece.color === color) {
          score += pieceValue + posValue;
        } else {
          score -= pieceValue + posValue;
        }
      }
    }
  }
  
  return score;
}

// AI move selection with minimax and alpha-beta pruning
export function getBestMove(board, color, gameState, difficulty) {
  const depth = Math.min(Math.ceil(difficulty / 2), 5);
  const randomness = Math.max(0, 10 - difficulty) * 50;
  
  const moves = getAllMoves(board, color, gameState);
  if (moves.length === 0) return null;
  
  // For very low difficulty, sometimes make random moves
  if (difficulty <= 2 && Math.random() < 0.5) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const testBoard = cloneBoard(board);
    testBoard[move.toRow][move.toCol] = testBoard[move.fromRow][move.fromCol];
    testBoard[move.fromRow][move.fromCol] = null;
    
    if (move.enPassant) {
      testBoard[move.fromRow][move.toCol] = null;
    }
    
    const score = minimax(testBoard, depth - 1, -Infinity, Infinity, false, color, gameState) + 
                  (Math.random() * randomness - randomness / 2);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

function minimax(board, depth, alpha, beta, isMaximizing, aiColor, gameState) {
  if (depth === 0) {
    return evaluateBoard(board, aiColor);
  }
  
  const currentColor = isMaximizing ? aiColor : (aiColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE);
  const moves = getAllMoves(board, currentColor, gameState);
  
  if (moves.length === 0) {
    if (isKingInCheck(board, currentColor)) {
      return isMaximizing ? -100000 : 100000;
    }
    return 0;
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const testBoard = cloneBoard(board);
      testBoard[move.toRow][move.toCol] = testBoard[move.fromRow][move.fromCol];
      testBoard[move.fromRow][move.fromCol] = null;
      
      const evaluation = minimax(testBoard, depth - 1, alpha, beta, false, aiColor, gameState);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const testBoard = cloneBoard(board);
      testBoard[move.toRow][move.toCol] = testBoard[move.fromRow][move.fromCol];
      testBoard[move.fromRow][move.fromCol] = null;
      
      const evaluation = minimax(testBoard, depth - 1, alpha, beta, true, aiColor, gameState);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Convert position to algebraic notation
export function toAlgebraic(row, col) {
  return String.fromCharCode(97 + col) + (8 - row);
}

export { PIECES, COLORS };