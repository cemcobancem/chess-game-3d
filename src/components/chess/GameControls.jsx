import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Flag, Undo2, PlayCircle } from "lucide-react";

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Novice",
  3: "Easy",
  4: "Casual",
  5: "Intermediate",
  6: "Advanced",
  7: "Expert",
  8: "Master",
  9: "Grandmaster",
  10: "Magnus"
};

export default function GameControls({ 
  difficulty, 
  onDifficultyChange, 
  onNewGame, 
  onUndo, 
  onResign,
  canUndo,
  gameOver 
}) {
  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
      <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wider">Game Controls</h3>
      
      <div className="space-y-4">
        {/* Difficulty Selector */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-wider">AI Difficulty</label>
          <Select value={difficulty.toString()} onValueChange={(v) => onDifficultyChange(parseInt(v))}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <SelectItem 
                  key={level} 
                  value={level.toString()}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                      {level}
                    </span>
                    <span>{DIFFICULTY_LABELS[level]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/40">
            <span>Easy</span>
            <span>Hard</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ width: `${difficulty * 10}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            onClick={onNewGame}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-purple-500/25"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            New Game
          </Button>
          
          <Button 
            onClick={onUndo}
            disabled={!canUndo || gameOver}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </Button>
        </div>

        {!gameOver && (
          <Button 
            onClick={onResign}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Flag className="w-4 h-4 mr-2" />
            Resign
          </Button>
        )}
      </div>
    </div>
  );
}