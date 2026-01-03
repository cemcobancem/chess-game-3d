import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PIECES, COLORS } from './ChessEngine';

const BOARD_SIZE = 8;
const SQUARE_SIZE = 1;
const PIECE_SCALE = 0.55;

// 3D piece geometries using basic shapes
const createPieceGeometry = (type, style = 'classic') => {
  if (style === 'modern') {
    return createModernPieceGeometry(type);
  } else if (style === 'minimal') {
    return createMinimalPieceGeometry(type);
  }
  
  // Classic style
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

// Modern style pieces - angular and geometric
const createModernPieceGeometry = (type) => {
  const group = new THREE.Group();
  
  switch (type) {
    case PIECES.PAWN:
      const pawnBase = new THREE.ConeGeometry(0.3, 0.4, 6);
      const pawnTop = new THREE.SphereGeometry(0.2, 8, 8);
      const pawnBaseMesh = new THREE.Mesh(pawnBase);
      pawnBaseMesh.position.y = 0.2;
      const pawnTopMesh = new THREE.Mesh(pawnTop);
      pawnTopMesh.position.y = 0.5;
      group.add(pawnBaseMesh, pawnTopMesh);
      break;
    case PIECES.ROOK:
      const rookBody = new THREE.BoxGeometry(0.5, 0.8, 0.5);
      const rookBodyMesh = new THREE.Mesh(rookBody);
      rookBodyMesh.position.y = 0.4;
      group.add(rookBodyMesh);
      for (let i = 0; i < 4; i++) {
        const battlement = new THREE.BoxGeometry(0.12, 0.15, 0.12);
        const battlementMesh = new THREE.Mesh(battlement);
        const angle = (i / 4) * Math.PI * 2;
        battlementMesh.position.x = Math.cos(angle) * 0.2;
        battlementMesh.position.z = Math.sin(angle) * 0.2;
        battlementMesh.position.y = 0.88;
        group.add(battlementMesh);
      }
      break;
    case PIECES.KNIGHT:
      const knightBody = new THREE.BoxGeometry(0.4, 0.6, 0.4);
      const knightBodyMesh = new THREE.Mesh(knightBody);
      knightBodyMesh.position.y = 0.3;
      const knightHead = new THREE.BoxGeometry(0.3, 0.4, 0.5);
      const knightHeadMesh = new THREE.Mesh(knightHead);
      knightHeadMesh.position.y = 0.7;
      knightHeadMesh.position.z = 0.1;
      knightHeadMesh.rotation.x = -0.2;
      group.add(knightBodyMesh, knightHeadMesh);
      break;
    case PIECES.BISHOP:
      const bishopBody = new THREE.ConeGeometry(0.3, 1, 6);
      const bishopBodyMesh = new THREE.Mesh(bishopBody);
      bishopBodyMesh.position.y = 0.5;
      const bishopTop = new THREE.SphereGeometry(0.15, 8, 8);
      const bishopTopMesh = new THREE.Mesh(bishopTop);
      bishopTopMesh.position.y = 1.05;
      group.add(bishopBodyMesh, bishopTopMesh);
      break;
    case PIECES.QUEEN:
      const queenBody = new THREE.ConeGeometry(0.35, 0.9, 8);
      const queenBodyMesh = new THREE.Mesh(queenBody);
      queenBodyMesh.position.y = 0.45;
      group.add(queenBodyMesh);
      for (let i = 0; i < 8; i++) {
        const spike = new THREE.ConeGeometry(0.05, 0.25, 4);
        const spikeMesh = new THREE.Mesh(spike);
        const angle = (i / 8) * Math.PI * 2;
        spikeMesh.position.x = Math.cos(angle) * 0.22;
        spikeMesh.position.z = Math.sin(angle) * 0.22;
        spikeMesh.position.y = 1.05;
        group.add(spikeMesh);
      }
      break;
    case PIECES.KING:
      const kingBody = new THREE.ConeGeometry(0.35, 1, 8);
      const kingBodyMesh = new THREE.Mesh(kingBody);
      kingBodyMesh.position.y = 0.5;
      const crossV = new THREE.BoxGeometry(0.08, 0.35, 0.08);
      const crossVMesh = new THREE.Mesh(crossV);
      crossVMesh.position.y = 1.2;
      const crossH = new THREE.BoxGeometry(0.25, 0.08, 0.08);
      const crossHMesh = new THREE.Mesh(crossH);
      crossHMesh.position.y = 1.25;
      group.add(kingBodyMesh, crossVMesh, crossHMesh);
      break;
  }
  
  return mergeGeometries(group);
};

// Minimal style pieces - simple and clean
const createMinimalPieceGeometry = (type) => {
  switch (type) {
    case PIECES.PAWN:
      return new THREE.SphereGeometry(0.25, 16, 16);
    case PIECES.ROOK:
      return new THREE.BoxGeometry(0.4, 0.7, 0.4);
    case PIECES.KNIGHT:
      const knightGroup = new THREE.Group();
      const knightCyl = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 16);
      const knightHead = new THREE.SphereGeometry(0.18, 16, 16);
      const knightCylMesh = new THREE.Mesh(knightCyl);
      knightCylMesh.position.y = 0.3;
      const knightHeadMesh = new THREE.Mesh(knightHead);
      knightHeadMesh.position.y = 0.7;
      knightGroup.add(knightCylMesh, knightHeadMesh);
      return mergeGeometries(knightGroup);
    case PIECES.BISHOP:
      return new THREE.ConeGeometry(0.25, 0.9, 16);
    case PIECES.QUEEN:
      const queenGroup = new THREE.Group();
      const queenCyl = new THREE.CylinderGeometry(0.18, 0.28, 0.8, 16);
      const queenSphere = new THREE.SphereGeometry(0.2, 16, 16);
      const queenCylMesh = new THREE.Mesh(queenCyl);
      queenCylMesh.position.y = 0.4;
      const queenSphereMesh = new THREE.Mesh(queenSphere);
      queenSphereMesh.position.y = 0.9;
      queenGroup.add(queenCylMesh, queenSphereMesh);
      return mergeGeometries(queenGroup);
    case PIECES.KING:
      const kingGroup = new THREE.Group();
      const kingCyl = new THREE.CylinderGeometry(0.18, 0.28, 0.9, 16);
      const kingCross = new THREE.BoxGeometry(0.3, 0.08, 0.08);
      const kingCylMesh = new THREE.Mesh(kingCyl);
      kingCylMesh.position.y = 0.45;
      const kingCrossMesh = new THREE.Mesh(kingCross);
      kingCrossMesh.position.y = 1;
      kingGroup.add(kingCylMesh, kingCrossMesh);
      return mergeGeometries(kingGroup);
    default:
      return new THREE.SphereGeometry(0.3, 16, 16);
  }
};

function createPawnGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.4, 0.45, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.2, 0.35, 0.7, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.6;
  group.add(bodyMesh);
  
  // Head
  const head = new THREE.SphereGeometry(0.28, 24, 24);
  const headMesh = new THREE.Mesh(head);
  headMesh.position.y = 1.1;
  group.add(headMesh);
  
  return mergeGeometries(group);
}

function createRookGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.45, 0.5, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.35, 0.4, 0.9, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.65;
  group.add(bodyMesh);
  
  // Top
  const top = new THREE.CylinderGeometry(0.4, 0.35, 0.25, 24);
  const topMesh = new THREE.Mesh(top);
  topMesh.position.y = 1.225;
  group.add(topMesh);
  
  // Battlements
  for (let i = 0; i < 4; i++) {
    const battlement = new THREE.BoxGeometry(0.18, 0.25, 0.18);
    const battlementMesh = new THREE.Mesh(battlement);
    const angle = (i / 4) * Math.PI * 2;
    battlementMesh.position.x = Math.cos(angle) * 0.3;
    battlementMesh.position.z = Math.sin(angle) * 0.3;
    battlementMesh.position.y = 1.475;
    group.add(battlementMesh);
  }
  
  return mergeGeometries(group);
}

function createKnightGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.45, 0.5, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.45;
  group.add(bodyMesh);
  
  // Neck
  const neck = new THREE.BoxGeometry(0.3, 0.65, 0.42);
  const neckMesh = new THREE.Mesh(neck);
  neckMesh.position.y = 1.05;
  neckMesh.position.z = 0.05;
  neckMesh.rotation.x = -0.3;
  group.add(neckMesh);
  
  // Head
  const head = new THREE.BoxGeometry(0.25, 0.38, 0.6);
  const headMesh = new THREE.Mesh(head);
  headMesh.position.y = 1.45;
  headMesh.position.z = 0.25;
  headMesh.rotation.x = 0.2;
  group.add(headMesh);
  
  // Ears
  const ear = new THREE.ConeGeometry(0.1, 0.2, 8);
  const earMesh = new THREE.Mesh(ear);
  earMesh.position.y = 1.7;
  earMesh.position.z = 0.12;
  group.add(earMesh);
  
  return mergeGeometries(group);
}

function createBishopGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.45, 0.5, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.2, 0.4, 0.8, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.6;
  group.add(bodyMesh);
  
  // Mitre
  const mitre = new THREE.SphereGeometry(0.32, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const mitreMesh = new THREE.Mesh(mitre);
  mitreMesh.position.y = 1.15;
  mitreMesh.scale.y = 1.8;
  group.add(mitreMesh);
  
  // Top ball
  const topBall = new THREE.SphereGeometry(0.14, 16, 16);
  const topBallMesh = new THREE.Mesh(topBall);
  topBallMesh.position.y = 1.8;
  group.add(topBallMesh);
  
  return mergeGeometries(group);
}

function createQueenGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.5, 0.55, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.25, 0.45, 1.0, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.7;
  group.add(bodyMesh);
  
  // Crown base
  const crownBase = new THREE.CylinderGeometry(0.32, 0.25, 0.25, 24);
  const crownBaseMesh = new THREE.Mesh(crownBase);
  crownBaseMesh.position.y = 1.325;
  group.add(crownBaseMesh);
  
  // Crown points
  for (let i = 0; i < 8; i++) {
    const point = new THREE.ConeGeometry(0.08, 0.35, 8);
    const pointMesh = new THREE.Mesh(point);
    const angle = (i / 8) * Math.PI * 2;
    pointMesh.position.x = Math.cos(angle) * 0.23;
    pointMesh.position.z = Math.sin(angle) * 0.23;
    pointMesh.position.y = 1.675;
    group.add(pointMesh);
  }
  
  // Top ball
  const topBall = new THREE.SphereGeometry(0.15, 16, 16);
  const topBallMesh = new THREE.Mesh(topBall);
  topBallMesh.position.y = 1.95;
  group.add(topBallMesh);
  
  return mergeGeometries(group);
}

function createKingGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.5, 0.55, 0.2, 24);
  const baseMesh = new THREE.Mesh(base);
  baseMesh.position.y = 0.1;
  group.add(baseMesh);
  
  // Body
  const body = new THREE.CylinderGeometry(0.25, 0.45, 1.1, 24);
  const bodyMesh = new THREE.Mesh(body);
  bodyMesh.position.y = 0.75;
  group.add(bodyMesh);
  
  // Crown base
  const crownBase = new THREE.CylinderGeometry(0.35, 0.25, 0.25, 24);
  const crownBaseMesh = new THREE.Mesh(crownBase);
  crownBaseMesh.position.y = 1.425;
  group.add(crownBaseMesh);
  
  // Cross vertical
  const crossV = new THREE.BoxGeometry(0.12, 0.5, 0.12);
  const crossVMesh = new THREE.Mesh(crossV);
  crossVMesh.position.y = 1.875;
  group.add(crossVMesh);
  
  // Cross horizontal
  const crossH = new THREE.BoxGeometry(0.38, 0.12, 0.12);
  const crossHMesh = new THREE.Mesh(crossH);
  crossHMesh.position.y = 1.95;
  group.add(crossHMesh);
  
  return mergeGeometries(group);
}

function mergeGeometries(group) {
  const geometries = [];
  
  group.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geom = child.geometry.clone();
      child.updateWorldMatrix(true, false);
      geom.applyMatrix4(child.matrixWorld);
      geometries.push(geom);
    }
  });
  
  if (geometries.length === 0) {
    return new THREE.SphereGeometry(0.3, 16, 16);
  }
  
  if (geometries.length === 1) {
    return geometries[0];
  }
  
  // Merge geometries properly
  let totalVertices = 0;
  let totalIndices = 0;
  
  geometries.forEach(geom => {
    if (!geom.index) {
      geom.setIndex(null);
    }
    totalVertices += geom.getAttribute('position').count;
    if (geom.index) {
      totalIndices += geom.index.count;
    }
  });
  
  const mergedGeometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(totalVertices * 3);
  const normalArray = new Float32Array(totalVertices * 3);
  const indices = [];
  
  let vertexOffset = 0;
  let indexOffset = 0;
  
  geometries.forEach(geom => {
    const positions = geom.getAttribute('position');
    const normals = geom.getAttribute('normal');
    
    // Copy positions
    for (let i = 0; i < positions.count; i++) {
      positionArray[(vertexOffset + i) * 3] = positions.getX(i);
      positionArray[(vertexOffset + i) * 3 + 1] = positions.getY(i);
      positionArray[(vertexOffset + i) * 3 + 2] = positions.getZ(i);
    }
    
    // Copy normals
    if (normals) {
      for (let i = 0; i < normals.count; i++) {
        normalArray[(vertexOffset + i) * 3] = normals.getX(i);
        normalArray[(vertexOffset + i) * 3 + 1] = normals.getY(i);
        normalArray[(vertexOffset + i) * 3 + 2] = normals.getZ(i);
      }
    }
    
    // Copy indices
    if (geom.index) {
      for (let i = 0; i < geom.index.count; i++) {
        indices.push(geom.index.getX(i) + vertexOffset);
      }
    } else {
      // Create indices if not present
      for (let i = 0; i < positions.count; i++) {
        indices.push(vertexOffset + i);
      }
    }
    
    vertexOffset += positions.count;
  });
  
  mergedGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
  mergedGeometry.setIndex(indices);
  mergedGeometry.computeVertexNormals();
  mergedGeometry.computeBoundingSphere();
  
  return mergedGeometry;
}

export default function ChessBoard3D({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  lastMove,
  isThinking,
  material = 'wood',
  style = 'classic'
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

  // Create piece materials based on selection
  const getPieceMaterials = useCallback(() => {
    switch (material) {
      case 'wood':
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0xd4a574, 
            metalness: 0.1, 
            roughness: 0.7,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0x4a2f1a, 
            metalness: 0.1, 
            roughness: 0.7,
            flatShading: false
          })
        };
      case 'marble':
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0xf5f5f5, 
            metalness: 0.2, 
            roughness: 0.3,
            envMapIntensity: 1.5,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.2, 
            roughness: 0.3,
            envMapIntensity: 1.5,
            flatShading: false
          })
        };
      case 'metal':
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0xc0c0c0, 
            metalness: 0.9, 
            roughness: 0.2,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a, 
            metalness: 0.9, 
            roughness: 0.2,
            flatShading: false
          })
        };
      case 'glass':
        return {
          white: new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff, 
            metalness: 0,
            roughness: 0.1,
            transparent: true,
            opacity: 0.5,
            transmission: 0.9,
            thickness: 0.5,
            ior: 1.5
          }),
          black: new THREE.MeshPhysicalMaterial({ 
            color: 0x333333, 
            metalness: 0,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7,
            transmission: 0.7,
            thickness: 0.5,
            ior: 1.5
          })
        };
      case 'stone':
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0x9e9e9e, 
            metalness: 0.1, 
            roughness: 0.9,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0x212121, 
            metalness: 0.1, 
            roughness: 0.9,
            flatShading: false
          })
        };
      case 'gold':
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            metalness: 0.8, 
            roughness: 0.2,
            emissive: 0x332200,
            emissiveIntensity: 0.2,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0xe8e8e8, 
            metalness: 0.9, 
            roughness: 0.2,
            flatShading: false
          })
        };
      default:
        return {
          white: new THREE.MeshStandardMaterial({ 
            color: 0xf5f5dc, 
            metalness: 0.3, 
            roughness: 0.4,
            flatShading: false
          }),
          black: new THREE.MeshStandardMaterial({ 
            color: 0x2d2d2d, 
            metalness: 0.3, 
            roughness: 0.4,
            flatShading: false
          })
        };
    }
  }, [material]);

  // Create materials
  const materials = useMemo(() => ({
    whitePiece: getPieceMaterials().white,
    blackPiece: getPieceMaterials().black,
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
  }), [getPieceMaterials]);

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
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
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
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 8, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x6c63ff, 0.5);
    pointLight.position.set(0, 12, 0);
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

    // Add board notation (letters and numbers)
    const createLabel = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      
      context.fillStyle = '#ffffff';
      context.font = 'bold 180px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Add letters (a-h) at the bottom
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    letters.forEach((letter, i) => {
      const texture = createLabel(letter);
      const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.6
      });
      const labelGeometry = new THREE.PlaneGeometry(0.4, 0.4);
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
      labelMesh.position.x = (i - 3.5) * SQUARE_SIZE;
      labelMesh.position.z = 4.4;
      labelMesh.position.y = 0.02;
      labelMesh.rotation.x = -Math.PI / 2;
      boardGroup.add(labelMesh);
    });
    
    // Add numbers (1-8) on the left
    for (let i = 0; i < 8; i++) {
      const texture = createLabel((8 - i).toString());
      const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.6
      });
      const labelGeometry = new THREE.PlaneGeometry(0.4, 0.4);
      const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
      labelMesh.position.x = -4.4;
      labelMesh.position.z = (i - 3.5) * SQUARE_SIZE;
      labelMesh.position.y = 0.02;
      labelMesh.rotation.x = -Math.PI / 2;
      boardGroup.add(labelMesh);
    }

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
          const geometry = createPieceGeometry(piece.type, style);
          const material = piece.color === COLORS.WHITE ? materials.whitePiece : materials.blackPiece;
          const mesh = new THREE.Mesh(geometry, material.clone());
          
          mesh.position.x = (colIndex - 3.5) * SQUARE_SIZE;
          mesh.position.z = (rowIndex - 3.5) * SQUARE_SIZE;
          mesh.position.y = 0.1;
          mesh.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE);
          mesh.castShadow = true;
          mesh.userData = { row: rowIndex, col: colIndex, type: 'piece' };
          
          sceneRef.current.add(mesh);
          piecesRef.current[`${rowIndex}-${colIndex}`] = mesh;
        }
      });
    });
  }, [board, materials, style]);

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