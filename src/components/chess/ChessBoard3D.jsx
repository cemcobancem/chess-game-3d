import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PIECES, COLORS } from './ChessEngine';

const BOARD_SIZE = 8;
const SQUARE_SIZE = 1;
const PIECE_SCALE = 0.35;

// 3D piece geometries using basic shapes
const createPieceGeometry = (type) => {
  switch (type) {
    case PIECES.PAWN:
      return createPawnGeometry();
    case PIECES.ROOK:
      return createRookGeometry();
    case PIECES.KNIGHT:
      return createKnightGeometry();
    case PIECES.BISHOP:
      return createBishopGeometry();
    case PIECES.QUEEN:
      return createQueenGeometry();
    case PIECES.KING:
      return createKingGeometry();
    default:
      return new THREE.SphereGeometry(0.3, 16, 16);
  }
};

function createPawnGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.15, 0.3, 0.5, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.4;
  group.add(bodyMesh);
  
  // Head
  const head = new THREE.SphereGeometry(0.2, 24, 24);
  const headMesh = new THREE.Mesh(head);
  headMesh.position.y = 0.75;
  group.add(headMesh);
  
  return mergeGeometries(group);
}

function createRookGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.4, 0.45, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.3, 0.35, 0.7, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.5;
  group.add(bodyMesh);
  
  // Top
  const top = new THREE.CylinderGeometry(0.35, 0.3, 0.2, 24);
  const topMesh = new THREE.Mesh(top);
  topMesh.position.y = 0.95;
  group.add(topMesh);
  
  // Battlements
  for (let i = 0; i < 4; i++) {
    const battlement = new THREE.BoxGeometry(0.15, 0.2, 0.15);
    const battlementMesh = new THREE.Mesh(battlement);
    const angle = (i / 4) * Math.PI * 2;
    battlementMesh.position.x = Math.cos(angle) * 0.25;
    battlementMesh.position.z = Math.sin(angle) * 0.25;
    battlementMesh.position.y = 1.15;
    group.add(battlementMesh);
  }
  
  return mergeGeometries(group);
}

function createKnightGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.4, 0.45, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.25, 0.35, 0.4, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.35;
  group.add(bodyMesh);
  
  // Neck
  const neck = new THREE.BoxGeometry(0.25, 0.5, 0.35);
  const neckMesh = new THREE.Mesh(neck);
  neckMesh.position.y = 0.8;
  neckMesh.position.z = 0.05;
  neckMesh.rotation.x = -0.3;
  group.add(neckMesh);
  
  // Head
  const head = new THREE.BoxGeometry(0.2, 0.3, 0.5);
  const headMesh = new THREE.Mesh(head);
  headMesh.position.y = 1.1;
  headMesh.position.z = 0.2;
  headMesh.rotation.x = 0.2;
  group.add(headMesh);
  
  // Ears
  const ear = new THREE.ConeGeometry(0.08, 0.15, 8);
  const earMesh = new THREE.Mesh(ear);
  earMesh.position.y = 1.3;
  earMesh.position.z = 0.1;
  group.add(earMesh);
  
  return mergeGeometries(group);
}

function createBishopGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.4, 0.45, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.15, 0.35, 0.6, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.45;
  group.add(bodyMesh);
  
  // Mitre
  const mitre = new THREE.SphereGeometry(0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const mitreMesh = new THREE.Mesh(mitre);
  mitreMesh.position.y = 0.85;
  mitreMesh.scale.y = 1.8;
  group.add(mitreMesh);
  
  // Top ball
  const topBall = new THREE.SphereGeometry(0.1, 16, 16);
  const topBallMesh = new THREE.Mesh(topBall);
  topBallMesh.position.y = 1.35;
  group.add(topBallMesh);
  
  return mergeGeometries(group);
}

function createQueenGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.45, 0.5, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.2, 0.4, 0.8, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.55;
  group.add(bodyMesh);
  
  // Crown base
  const crownBase = new THREE.CylinderGeometry(0.25, 0.2, 0.2, 24);
  const crownBaseMesh = new THREE.Mesh(crownBase);
  crownBaseMesh.position.y = 1.05;
  group.add(crownBaseMesh);
  
  // Crown points
  for (let i = 0; i < 8; i++) {
    const point = new THREE.ConeGeometry(0.06, 0.25, 8);
    const pointMesh = new THREE.Mesh(point);
    const angle = (i / 8) * Math.PI * 2;
    pointMesh.position.x = Math.cos(angle) * 0.18;
    pointMesh.position.z = Math.sin(angle) * 0.18;
    pointMesh.position.y = 1.3;
    group.add(pointMesh);
  }
  
  // Top ball
  const topBall = new THREE.SphereGeometry(0.12, 16, 16);
  const topBallMesh = new THREE.Mesh(topBall);
  topBallMesh.position.y = 1.5;
  group.add(topBallMesh);
  
  return mergeGeometries(group);
}

function createKingGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.45, 0.5, 0.15, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.075;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.2, 0.4, 0.9, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.6;
  group.add(bodyMesh);
  
  // Crown base
  const crownBase = new THREE.CylinderGeometry(0.28, 0.2, 0.2, 24);
  const crownBaseMesh = new THREE.Mesh(crownBase);
  crownBaseMesh.position.y = 1.15;
  group.add(crownBaseMesh);
  
  // Cross vertical
  const crossV = new THREE.BoxGeometry(0.1, 0.4, 0.1);
  const crossVMesh = new THREE.Mesh(crossV);
  crossVMesh.position.y = 1.5;
  group.add(crossVMesh);
  
  // Cross horizontal
  const crossH = new THREE.BoxGeometry(0.3, 0.1, 0.1);
  const crossHMesh = new THREE.Mesh(crossH);
  crossHMesh.position.y = 1.55;
  group.add(crossHMesh);
  
  return mergeGeometries(group);
}

function mergeGeometries(group) {
  const geometries = [];
  group.traverse((child) => {
    if (child.geometry) {
      const cloned = child.geometry.clone();
      cloned.applyMatrix4(child.matrix);
      child.updateWorldMatrix(true, false);
      cloned.applyMatrix4(child.matrixWorld);
      geometries.push(cloned);
    }
  });
  
  // Simple merge by using the first geometry if we can't merge
  if (geometries.length === 0) return new THREE.SphereGeometry(0.3, 16, 16);
  
  // For simplicity, return a combined geometry using BufferGeometryUtils approach
  const combined = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  
  geometries.forEach(geom => {
    const pos = geom.getAttribute('position');
    const norm = geom.getAttribute('normal');
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (norm) {
          normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
        } else {
          normals.push(0, 1, 0);
        }
      }
    }
  });
  
  combined.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  combined.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  combined.computeVertexNormals();
  
  return combined;
}

export default function ChessBoard3D({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  lastMove,
  isThinking 
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const piecesRef = useRef({});
  const highlightsRef = useRef([]);
  const animationRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Create materials
  const materials = useMemo(() => ({
    whitePiece: new THREE.MeshStandardMaterial({ 
      color: 0xf5f5dc, 
      metalness: 0.3, 
      roughness: 0.4 
    }),
    blackPiece: new THREE.MeshStandardMaterial({ 
      color: 0x2d2d2d, 
      metalness: 0.3, 
      roughness: 0.4 
    }),
    lightSquare: new THREE.MeshStandardMaterial({ 
      color: 0xe8d4b8, 
      metalness: 0.1, 
      roughness: 0.8 
    }),
    darkSquare: new THREE.MeshStandardMaterial({ 
      color: 0x8b6914, 
      metalness: 0.1, 
      roughness: 0.8 
    }),
    selected: new THREE.MeshStandardMaterial({ 
      color: 0x6c63ff, 
      metalness: 0.2, 
      roughness: 0.5,
      transparent: true,
      opacity: 0.7
    }),
    validMove: new THREE.MeshStandardMaterial({ 
      color: 0x4ade80, 
      metalness: 0.2, 
      roughness: 0.5,
      transparent: true,
      opacity: 0.6
    }),
    lastMove: new THREE.MeshStandardMaterial({ 
      color: 0xfbbf24, 
      metalness: 0.2, 
      roughness: 0.5,
      transparent: true,
      opacity: 0.5
    }),
    boardEdge: new THREE.MeshStandardMaterial({ 
      color: 0x4a3728, 
      metalness: 0.2, 
      roughness: 0.6 
    })
  }), []);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6c63ff, 0.3);
    pointLight.position.set(-5, 8, -5);
    scene.add(pointLight);

    // Create board
    const boardGroup = new THREE.Group();
    
    // Board squares
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isLight = (row + col) % 2 === 0;
        const geometry = new THREE.BoxGeometry(SQUARE_SIZE, 0.1, SQUARE_SIZE);
        const material = isLight ? materials.lightSquare : materials.darkSquare;
        const square = new THREE.Mesh(geometry, material);
        
        square.position.x = (col - 3.5) * SQUARE_SIZE;
        square.position.z = (row - 3.5) * SQUARE_SIZE;
        square.position.y = 0;
        square.receiveShadow = true;
        square.userData = { row, col, type: 'square' };
        
        boardGroup.add(square);
      }
    }

    // Board edge
    const edgeGeometry = new THREE.BoxGeometry(BOARD_SIZE + 0.5, 0.3, BOARD_SIZE + 0.5);
    const edge = new THREE.Mesh(edgeGeometry, materials.boardEdge);
    edge.position.y = -0.15;
    edge.receiveShadow = true;
    boardGroup.add(edge);

    scene.add(boardGroup);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [materials]);

  // Update pieces
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old pieces
    Object.values(piecesRef.current).forEach(piece => {
      sceneRef.current.remove(piece);
    });
    piecesRef.current = {};

    // Add new pieces
    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          const geometry = createPieceGeometry(piece.type);
          const material = piece.color === COLORS.WHITE ? materials.whitePiece : materials.blackPiece;
          const mesh = new THREE.Mesh(geometry, material.clone());
          
          mesh.position.x = (colIndex - 3.5) * SQUARE_SIZE;
          mesh.position.z = (rowIndex - 3.5) * SQUARE_SIZE;
          mesh.position.y = 0.05;
          mesh.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE);
          mesh.castShadow = true;
          mesh.userData = { row: rowIndex, col: colIndex, type: 'piece' };
          
          sceneRef.current.add(mesh);
          piecesRef.current[`${rowIndex}-${colIndex}`] = mesh;
        }
      });
    });
  }, [board, materials]);

  // Update highlights
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old highlights
    highlightsRef.current.forEach(highlight => {
      sceneRef.current.remove(highlight);
    });
    highlightsRef.current = [];

    // Last move highlights
    if (lastMove) {
      const fromHighlight = new THREE.Mesh(
        new THREE.BoxGeometry(SQUARE_SIZE * 0.9, 0.02, SQUARE_SIZE * 0.9),
        materials.lastMove
      );
      fromHighlight.position.x = (lastMove.fromCol - 3.5) * SQUARE_SIZE;
      fromHighlight.position.z = (lastMove.fromRow - 3.5) * SQUARE_SIZE;
      fromHighlight.position.y = 0.06;
      sceneRef.current.add(fromHighlight);
      highlightsRef.current.push(fromHighlight);

      const toHighlight = new THREE.Mesh(
        new THREE.BoxGeometry(SQUARE_SIZE * 0.9, 0.02, SQUARE_SIZE * 0.9),
        materials.lastMove
      );
      toHighlight.position.x = (lastMove.toCol - 3.5) * SQUARE_SIZE;
      toHighlight.position.z = (lastMove.toRow - 3.5) * SQUARE_SIZE;
      toHighlight.position.y = 0.06;
      sceneRef.current.add(toHighlight);
      highlightsRef.current.push(toHighlight);
    }

    // Selected square highlight
    if (selectedSquare) {
      const highlight = new THREE.Mesh(
        new THREE.BoxGeometry(SQUARE_SIZE * 0.9, 0.02, SQUARE_SIZE * 0.9),
        materials.selected
      );
      highlight.position.x = (selectedSquare.col - 3.5) * SQUARE_SIZE;
      highlight.position.z = (selectedSquare.row - 3.5) * SQUARE_SIZE;
      highlight.position.y = 0.06;
      sceneRef.current.add(highlight);
      highlightsRef.current.push(highlight);
    }

    // Valid moves highlights
    validMoves.forEach(move => {
      const highlight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16),
        materials.validMove
      );
      highlight.position.x = (move.toCol - 3.5) * SQUARE_SIZE;
      highlight.position.z = (move.toRow - 3.5) * SQUARE_SIZE;
      highlight.position.y = 0.08;
      sceneRef.current.add(highlight);
      highlightsRef.current.push(highlight);
    });
  }, [selectedSquare, validMoves, lastMove, materials]);

  // Click handler
  const handleClick = useCallback((event) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current || isThinking) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    for (const intersect of intersects) {
      const obj = intersect.object;
      if (obj.userData && (obj.userData.type === 'square' || obj.userData.type === 'piece')) {
        onSquareClick(obj.userData.row, obj.userData.col);
        break;
      }
    }
  }, [onSquareClick, isThinking]);

  // Touch handler
  const handleTouch = useCallback((event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, [handleClick]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-pointer relative"
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      {isThinking && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="bg-white/90 rounded-xl px-6 py-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-800 font-medium">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}