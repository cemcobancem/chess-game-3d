import React from 'react';
import { Crown, Shield, AlertTriangle, Trophy, Handshake } from "lucide-react";
import { COLORS } from './ChessEngine';

export default function GameStatus({ currentTurn, gameStatus, playerColor }) {
  const isPlayerTurn = currentTurn === playerColor;
  const turnText = currentTurn === COLORS.WHITE ? 'White' : 'Black';
  
  const getStatusDisplay = () => {
    switch (gameStatus.status) {
      case 'checkmate':
        const winner = gameStatus.winner === playerColor ? 'You win!' : 'AI wins!';
        return {
          icon: <Trophy className="w-6 h-6" />,
          text: `Checkmate! ${winner}`,
          color: gameStatus.winner === playerColor ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
          pulse: true
        };
      case 'stalemate':
        return {
          icon: <Handshake className="w-6 h-6" />,
          text: 'Stalemate - Draw!',
          color: 'from-yellow-500 to-amber-600',
          pulse: false
        };
      case 'check':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          text: `${turnText} is in Check!`,
          color: 'from-orange-500 to-red-500',
          pulse: true
        };
      default:
        return {
          icon: isPlayerTurn ? <Crown className="w-6 h-6" /> : <Shield className="w-6 h-6" />,
          text: isPlayerTurn ? 'Your Turn' : 'AI Thinking...',
          color: isPlayerTurn ? 'from-purple-500 to-indigo-600' : 'from-gray-600 to-gray-700',
          pulse: false
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
      {/* Turn Indicator */}
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${status.color} p-4 ${status.pulse ? 'animate-pulse' : ''}`}>
        <div className="flex items-center gap-3 text-white relative z-10">
          {status.icon}
          <div>
            <p className="font-bold text-lg">{status.text}</p>
            <p className="text-white/70 text-sm">
              {gameStatus.status === 'playing' && `${turnText} to move`}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
      </div>

      {/* Player Colors */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-3 ${playerColor === COLORS.WHITE ? 'bg-white/10 ring-2 ring-purple-500' : 'bg-white/5'}`}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cream-100 shadow-inner border border-gray-300" style={{ backgroundColor: '#f5f5dc' }} />
            <span className="text-white/80 text-sm font-medium">You (White)</span>
          </div>
        </div>
        <div className={`rounded-xl p-3 ${playerColor === COLORS.BLACK ? 'bg-white/10 ring-2 ring-purple-500' : 'bg-white/5'}`}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-800 shadow-inner border border-gray-600" />
            <span className="text-white/80 text-sm font-medium">AI (Black)</span>
          </div>
        </div>
      </div>
    </div>
  );
}