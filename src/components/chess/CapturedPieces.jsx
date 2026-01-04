import React from 'react';
import { PIECES, COLORS } from './ChessEngine';

const PIECE_SYMBOLS = {
  [PIECES.PAWN]: { white: '♙', black: '♟' },
  [PIECES.KNIGHT]: { white: '♘', black: '♞' },
  [PIECES.BISHOP]: { white: '♗', black: '♝' },
  [PIECES.ROOK]: { white: '♖', black: '♜' },
  [PIECES.QUEEN]: { white: '♕', black: '♛' },
  [PIECES.KING]: { white: '♔', black: '♚' }
};

const PIECE_VALUES = {
  [PIECES.PAWN]: 1,
  [PIECES.KNIGHT]: 3,
  [PIECES.BISHOP]: 3,
  [PIECES.ROOK]: 5,
  [PIECES.QUEEN]: 9,
  [PIECES.KING]: 0
};

export default function CapturedPieces({ capturedPieces, color, label }) {
  const pieces = capturedPieces.filter(p => p.color === color);
  
  // Calculate material advantage
  const materialValue = pieces.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);
  
  // Sort pieces by value
  const sortedPieces = [...pieces].sort((a, b) => PIECE_VALUES[b.type] - PIECE_VALUES[a.type]);
  
  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">{label}</h3>
        {materialValue > 0 && (
          <span className="text-green-400 text-xs font-bold">+{materialValue}</span>
        )}
      </div>
      
      <div className="min-h-[80px] flex flex-wrap gap-2 items-center justify-center">
        {sortedPieces.length === 0 ? (
          <div className="text-white/30 text-sm italic w-full text-center py-6">
            No captures yet
          </div>
        ) : (
          sortedPieces.map((piece, index) => (
            <div
              key={index}
              className="text-4xl opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-200 drop-shadow-lg"
              style={{ color: piece.color === COLORS.WHITE ? '#f5f5dc' : '#2d2d2d' }}
              title={`${piece.color === COLORS.WHITE ? 'White' : 'Black'} ${piece.type}`}
            >
              {PIECE_SYMBOLS[piece.type][piece.color]}
            </div>
          ))
        )}
      </div>
    </div>
  );
}