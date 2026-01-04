# 3D Chess Game

A stunning 3D chess game built with React, Three.js, and advanced game AI. Play against an intelligent AI opponent with customizable difficulty levels and visual themes.

![3D Chess Game](https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1200&h=630&fit=crop)

## Features

### 🎮 Core Gameplay

- **Full Chess Rules Implementation**
  - Complete chess rules including castling, en passant, and pawn promotion
  - Check, checkmate, and stalemate detection
  - Legal move validation and highlighting
  - Move history with algebraic notation

- **AI Opponent**
  - Adjustable difficulty levels (1-10)
  - Minimax algorithm with alpha-beta pruning
  - Position evaluation using piece-square tables
  - Strategic play that improves with difficulty

### 🎨 Visual Customization

- **Piece Materials**
  - Wood (classic)
  - Marble (elegant)
  - Metal (modern)
  - Glass (transparent)
  - Stone (solid)
  - Gold & Silver (luxury)

- **Piece Styles**
  - Classic (traditional chess pieces)
  - Modern (angular geometric design)
  - Minimal (clean simplified shapes)

- **Board Types**
  - Classic Wood
  - Marble
  - Tournament Green
  - Ocean Blue
  - Dark Mode
  - Cream & Brown

### ⚡ Game Features

- **Auto-Save & Resume**
  - Game state automatically saved to local storage
  - Continue your game after page reload
  - All settings and preferences preserved

- **Game Controls**
  - New Game
  - Undo Move (reverts both player and AI moves)
  - Resign
  - Fullscreen mode

- **Visual Feedback**
  - Selected piece highlighting
  - Valid move indicators
  - Last move highlighting
  - Captured pieces display
  - Game status indicators (check, checkmate, stalemate)
  - AI thinking animation

- **Move History**
  - Complete move log in algebraic notation
  - Special move indicators (castling, promotion, check, checkmate)
  - Auto-scroll to latest move

### 📱 User Interface

- **Responsive Design**
  - Optimized for desktop and mobile
  - Touch-friendly controls
  - Adaptive layout for different screen sizes

- **Settings Panel**
  - Sliding side panel for settings
  - Organized controls for customization
  - Game controls and move history

- **3D Board**
  - Interactive 3D chess board with Three.js
  - Orbit controls for camera movement
  - Board notation (ranks and files)
  - Smooth animations and shadows
  - Realistic lighting

### 📊 Game Information

- **Captured Pieces Display**
  - Shows captured pieces for both colors
  - Material advantage calculation
  - Sorted by piece value

- **Game Status**
  - Current turn indicator
  - Check/checkmate/stalemate notifications
  - Player vs AI color display

## Technology Stack

- **Frontend Framework**: React 18
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Icons**: Lucide React

## Game Rules

The game follows standard chess rules:

1. **Pieces**: King, Queen, Rook, Bishop, Knight, Pawn
2. **Special Moves**:
   - Castling (kingside and queenside)
   - En passant capture
   - Pawn promotion (Queen, Rook, Bishop, Knight)
3. **Win Conditions**:
   - Checkmate: King is in check with no legal moves
   - Resignation
4. **Draw Conditions**:
   - Stalemate: No legal moves available but king is not in check

## How to Play

1. **Select a Piece**: Click on one of your pieces (white)
2. **View Valid Moves**: Green indicators show where you can move
3. **Make Your Move**: Click on a highlighted square to move
4. **AI Response**: The AI will automatically make its move
5. **Special Moves**:
   - Click the king on its starting square to castle (if legal)
   - Move a pawn to the last rank to promote it
   - En passant is automatic when conditions are met

## Controls

- **Mouse**: Click and drag to rotate the camera
- **Scroll**: Zoom in/out
- **Click**: Select pieces and make moves
- **Settings Button**: Access game settings, customization, and move history

## AI Difficulty Levels

- **1-2**: Beginner - Makes occasional random moves
- **3-4**: Easy - Basic strategy
- **5-6**: Medium - Balanced play
- **7-8**: Hard - Strong tactical play
- **9-10**: Expert - Deep calculation, strong strategy

## Installation

```bash
# This is a Base44 app
# Visit the live app or clone and deploy on Base44 platform
Development
Built on the Base44 platform with:

Real-time preview
Hot module replacement
Integrated backend services
Credits
Chess engine logic with minimax algorithm
3D piece models created with Three.js geometries
UI components from shadcn/ui library
License
MIT License - feel free to use and modify for your own projects!

Enjoy your game! ♔
