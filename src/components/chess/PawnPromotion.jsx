import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECES, COLORS } from './ChessEngine';

const PROMOTION_PIECES = [
  { type: PIECES.QUEEN, name: 'Queen', symbol: '♕' },
  { type: PIECES.ROOK, name: 'Rook', symbol: '♖' },
  { type: PIECES.BISHOP, name: 'Bishop', symbol: '♗' },
  { type: PIECES.KNIGHT, name: 'Knight', symbol: '♘' }
];

export default function PawnPromotion({ show, color, onSelect }) {
  if (!show) return null;

  const isWhite = color === COLORS.WHITE;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl border border-white/10 max-w-sm w-full"
          >
            <h2 className="text-white text-xl font-bold text-center mb-2">
              Pawn Promotion
            </h2>
            <p className="text-white/60 text-center text-sm mb-6">
              Choose a piece for your pawn
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              {PROMOTION_PIECES.map((piece) => (
                <motion.button
                  key={piece.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(piece.type)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                    transition-all duration-200 border-2
                    ${isWhite 
                      ? 'bg-cream-100 border-gray-300 hover:border-purple-500 text-gray-800' 
                      : 'bg-gray-800 border-gray-600 hover:border-purple-500 text-white'
                    }
                    hover:shadow-lg hover:shadow-purple-500/20
                  `}
                  style={{ backgroundColor: isWhite ? '#f5f5dc' : '#2d2d2d' }}
                >
                  <span className="text-4xl">{piece.symbol}</span>
                  <span className="text-xs font-medium opacity-70">{piece.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}