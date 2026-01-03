import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Box, Grid3x3 } from "lucide-react";

const MATERIALS = [
  { id: 'wood', name: 'Wood', icon: '🌳' },
  { id: 'marble', name: 'Marble', icon: '💎' },
  { id: 'metal', name: 'Metal', icon: '⚙️' },
  { id: 'glass', name: 'Glass', icon: '🔮' },
  { id: 'stone', name: 'Stone', icon: '🗿' },
  { id: 'gold', name: 'Gold & Silver', icon: '👑' }
];

const STYLES = [
  { id: 'classic', name: 'Classic', icon: '♔' },
  { id: 'modern', name: 'Modern', icon: '▲' },
  { id: 'minimal', name: 'Minimal', icon: '●' }
];

const BOARD_TYPES = [
  { id: 'classic', name: 'Classic Wood', icon: '🌰' },
  { id: 'marble', name: 'Marble', icon: '⬜' },
  { id: 'green', name: 'Tournament Green', icon: '🟢' },
  { id: 'blue', name: 'Ocean Blue', icon: '🌊' },
  { id: 'dark', name: 'Dark Mode', icon: '🌑' },
  { id: 'cream', name: 'Cream & Brown', icon: '☕' }
];

export default function PieceCustomization({ material, style, boardType, onMaterialChange, onStyleChange, onBoardTypeChange }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
      <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wider">Piece Customization</h3>
      
      <div className="space-y-4">
        {/* Material Selector */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3 h-3" />
            Material
          </label>
          <Select value={material} onValueChange={onMaterialChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {MATERIALS.map(mat => (
                <SelectItem 
                  key={mat.id} 
                  value={mat.id}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{mat.icon}</span>
                    <span>{mat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Selector */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-2">
            <Box className="w-3 h-3" />
            Style
          </label>
          <Select value={style} onValueChange={onStyleChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {STYLES.map(s => (
                <SelectItem 
                  key={s.id} 
                  value={s.id}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{s.icon}</span>
                    <span>{s.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Board Type Selector */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-2">
            <Grid3x3 className="w-3 h-3" />
            Board Type
          </label>
          <Select value={boardType} onValueChange={onBoardTypeChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {BOARD_TYPES.map(type => (
                <SelectItem 
                  key={type.id} 
                  value={type.id}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Material Preview */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="text-white/40 text-xs mb-2">Preview</div>
          <div className="flex justify-center gap-3">
            <div className="w-10 h-10 rounded-lg shadow-lg" style={getMaterialPreviewStyle(material, 'white')} />
            <div className="w-10 h-10 rounded-lg shadow-lg" style={getMaterialPreviewStyle(material, 'black')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getMaterialPreviewStyle(material, color) {
  const isWhite = color === 'white';
  
  switch (material) {
    case 'wood':
      return {
        background: isWhite 
          ? 'linear-gradient(135deg, #d4a574 0%, #c8956f 100%)'
          : 'linear-gradient(135deg, #654321 0%, #4a2f1a 100%)',
        border: '1px solid rgba(0,0,0,0.2)'
      };
    case 'marble':
      return {
        background: isWhite
          ? 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
          : 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      };
    case 'metal':
      return {
        background: isWhite
          ? 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #909090 100%)'
          : 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)'
      };
    case 'glass':
      return {
        background: isWhite
          ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(240,240,240,0.4) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(50,50,50,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1), 0 2px 10px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.15)'
      };
    case 'stone':
      return {
        background: isWhite
          ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
          : 'linear-gradient(135deg, #424242 0%, #212121 100%)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        border: '1px solid rgba(0,0,0,0.3)'
      };
    case 'gold':
      return {
        background: isWhite
          ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)'
          : 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
        boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
        border: '1px solid rgba(255,255,255,0.3)'
      };
    default:
      return { background: isWhite ? '#f5f5dc' : '#2d2d2d' };
  }
}