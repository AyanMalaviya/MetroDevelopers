// src/components/InteractiveSiteMap/Park1Model3D.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from '../../context/ThemeContext';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  X,
  Compass,
  Phone,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getPlotData } from '../../services/dataService';

const ADMIN_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

/* ── Status Colors & Labels (Exact Alignment with InteractiveSiteMap) ── */
const STATUS_COLORS = {
  available:    '#10B981', // Emerald green
  sold:         '#808080', // Slate grey
  'for-lease':  '#DC2626', // Brand red
  'pre-leased': '#3B82F6', // Corporate blue
};

const getStatusColorHex = (status) => {
  const s = String(status || 'available').toLowerCase();
  return STATUS_COLORS[s] || STATUS_COLORS.available;
};

const getStatusLabel = (status) => {
  const s = String(status || 'available').toLowerCase();
  switch (s) {
    case 'sold':       return 'Sold';
    case 'for-lease':  return 'Available for Lease';
    case 'pre-leased': return 'Pre-Leased';
    default:           return 'Available';
  }
};

const getStatusBadgeClass = (status) => {
  const s = String(status || 'available').toLowerCase();
  switch (s) {
    case 'sold':
      return 'bg-slate-200 text-slate-800 dark:bg-gray-800 dark:text-gray-300';
    case 'for-lease':
      return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
    case 'pre-leased':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
  }
};

/* ── 1. Ultra-Light Procedural Canvas Textures ── */
function createMetroBrandAtlas() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');

  // Left Half (0..128): Dark Charcoal Louver Backing + METRO Twin-Peak Logo
  ctx.fillStyle = '#3a3837';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#2d2b2a';
  for (let x = 4; x < 128; x += 6) ctx.fillRect(x, 0, 2, 128);

  // Silver-white twin peaks M
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(18, 84);
  ctx.lineTo(48, 28);
  ctx.lineTo(66, 62);
  ctx.lineTo(82, 36);
  ctx.lineTo(110, 84);
  ctx.lineTo(90, 84);
  ctx.lineTo(81, 66);
  ctx.lineTo(66, 84);
  ctx.lineTo(48, 52);
  ctx.lineTo(36, 84);
  ctx.closePath();
  ctx.fill();

  // Crimson-red triangular accents inside twin peaks
  ctx.fillStyle = '#d93036';
  ctx.beginPath();
  ctx.moveTo(48, 28); ctx.lineTo(59, 49); ctx.lineTo(43, 49); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(82, 36); ctx.lineTo(93, 55); ctx.lineTo(75, 55); ctx.closePath(); ctx.fill();

  // METRO Wordmark
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('METRO', 64, 106);

  // Right Half (128..256): Concrete Sign "METRO INDUSTRIAL PARK"
  ctx.fillStyle = '#dcd8d0';
  ctx.fillRect(128, 0, 128, 128);
  ctx.fillStyle = '#cc2936';
  ctx.font = '800 18px Inter, system-ui, sans-serif';
  ctx.fillText('METRO', 192, 34);
  ctx.font = '800 16px Inter, system-ui, sans-serif';
  ctx.fillText('INDUSTRIAL', 192, 64);
  ctx.font = '800 18px Inter, system-ui, sans-serif';
  ctx.fillText('PARK', 192, 94);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function createShutterTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#cfd4da';
  ctx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y += 4) {
    ctx.fillStyle = '#b4bcc5';
    ctx.fillRect(0, y, 64, 1);
    ctx.fillStyle = '#e3e7ec';
    ctx.fillRect(0, y + 1, 64, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGableRoofGeo() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, 0);
  shape.lineTo(0.5, 0);
  shape.lineTo(0, 1.0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.0, bevelEnabled: false });
  geo.translate(0, 0, -0.5);
  geo.computeVertexNormals();
  return geo;
}

/* ── 2. Master 63-Plot Master Geometry Registry ── */
const MASTER_PLOTS = [];
function definePlot(id, block, x, z, w, d, facing, roadLabel, dimText) {
  const approxSqFt = Math.round((w * 10) * (d * 10) / 50) * 50;
  MASTER_PLOTS.push({
    kind: 'plot',
    id: String(id),
    title: `Plot #${String(id).padStart(2, '0')}`,
    block: `Block ${block}`,
    x, z, w, d,
    facing,
    roadLabel,
    dimText: dimText || `${(w * 10).toFixed(1)} × ${(d * 10).toFixed(1)} ft`,
    approxSqFt,
    unitType: 'PEB Shed + 2F Office',
  });
}

// BLOCK A: East Strip (Plots 1–12, 13)
const blockAPlots = [
  [1,  32.0, 10.8, 4.5, '18m Spine Road', '112.0 × 52.4 ft'],
  [2,  27.4, 11.2, 4.5, '18m Spine Road', '115.2 × 45.9 ft'],
  [3,  22.8, 11.0, 4.5, '18m Spine Road', '111.6 × 45.9 ft'],
  [4,  18.2, 10.6, 4.5, '18m Spine Road', '107.0 × 45.9 ft'],
  [5,  13.6, 10.1, 4.5, '18m Spine Road', '101.6 × 45.9 ft'],
  [6,   9.0,  9.8, 4.5, '18m Spine Road', '98.3 × 45.9 ft'],
  [7,   4.4,  9.9, 4.5, '18m Spine Road', '99.2 × 45.9 ft'],
  [8,  -0.2, 10.4, 4.5, '18m Spine Road', '104.6 × 45.9 ft'],
  [9,  -4.8, 10.1, 4.5, '18m Spine Road', '101.5 × 45.9 ft'],
  [10, -9.4, 10.5, 4.5, '9m East Road',   '105.3 × 45.9 ft'],
  [11,-14.0, 11.2, 4.5, '9m East Road',   '112.9 × 45.9 ft'],
];
blockAPlots.forEach(([id, z, w, d, rd, dim]) => {
  definePlot(id, 'A', 17.3 + w / 2, z, w, d, 'W', rd, dim);
});
definePlot(12, 'A', 17.3 + 14.4 / 2, -23.4, 14.4, 13.0, 'W', '9m East Road', '152.6 × 105.0 ft');
definePlot(13, 'A', 28.4, -40.8, 11.4, 12.6, 'S', '9m NE Entry Road', '113.6 × 139.2 ft');

// BLOCK B: Center-South Double Block (Plots 19–33)
definePlot(33, 'B', -6.0, 2.6, 4.7, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');
definePlot(32, 'B', -1.2, 2.6, 4.7, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');
definePlot(20, 'B',  3.6, 2.6, 4.7, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');
definePlot(19, 'B',  8.4, 2.6, 4.7, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');

const bRowZ = [9.5, 13.9, 18.3, 22.7, 27.1];
[21, 22, 23, 24, 25].forEach((id, idx) => {
  definePlot(id, 'B', 6.0, bRowZ[idx], 9.5, 4.3, 'E', '18m Spine Road', '98.4 × 45.9 ft');
});
[31, 30, 29, 28, 27].forEach((id, idx) => {
  definePlot(id, 'B', -3.6, bRowZ[idx], 9.5, 4.3, 'W', '9m Mid-West Road', '98.4 × 45.9 ft');
});
definePlot(26, 'B', -3.6, 33.1, 9.5, 7.4, 'W', '9m Mid-West Road', '97.8 × 81.0 ft');

// BLOCK C: Mid-West South Double Block (Plots 45–58)
definePlot(58, 'C', -26.25, 2.6, 4.1, 9.0, 'N', '18m Cross Road', '56.2 × 91.9 ft');
definePlot(57, 'C', -21.95, 2.6, 4.1, 9.0, 'N', '18m Cross Road', '56.2 × 91.9 ft');
definePlot(46, 'C', -17.85, 2.6, 3.8, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');
definePlot(45, 'C', -13.95, 2.6, 3.8, 9.0, 'N', '18m Cross Road', '49.2 × 91.9 ft');

[47, 48, 49, 50, 51].forEach((id, idx) => {
  const isLast = id === 51;
  definePlot(id, 'C', -16.1, isLast ? 27.4 : bRowZ[idx], 8.0, isLast ? 4.8 : 4.3, 'E', '9m Mid-West Road', '98.4 × 45.9 ft');
});
[56, 55, 54, 53, 52].forEach((id, idx) => {
  const isLast = id === 52;
  definePlot(id, 'C', -24.3, isLast ? 27.4 : bRowZ[idx], 8.0, isLast ? 4.8 : 4.3, 'W', '9m Far-West Road', '96.3 × 46.2 ft');
});

// BLOCK D: Far-West Strip (Plots 61, 62, 63)
definePlot(61, 'D', -37.8,  2.6, 11.4, 9.0, 'E', '9m Far-West Road', '131.3 × 84.6 ft');
definePlot(62, 'D', -35.8, 14.0,  7.4, 10.4, 'E', '9m Far-West Road', '66.5 × 109.4 ft');
definePlot(63, 'D', -35.8, 25.0,  7.4, 10.4, 'E', '9m Far-West Road', '66.5 × 106.8 ft');

// BLOCK E: North-Center Double Block (Plots 34–39, 18–14)
const eRowZ = [-10.4, -15.0, -19.6, -24.2, -28.8, -33.4];
[34, 35, 36, 37, 38, 39].forEach((id, idx) => {
  definePlot(id, 'E', -2.9, eRowZ[idx], 10.8, 4.4, 'W', '9m Mid-West Road', '113.2 × 45.9 ft');
});
[18, 17, 16, 15, 14].forEach((id, idx) => {
  const is14 = id === 14;
  definePlot(id, 'E', 8.1, is14 ? -29.3 : eRowZ[idx], 10.8, is14 ? 5.4 : 4.4, 'E', '9m East Road', is14 ? '113.2 × 68.2 ft' : '113.2 × 45.9 ft');
});

// BLOCK F: North-West Block (Plots 44–40, 59, 60)
definePlot(44, 'F', -18.3, -10.9, 12.4, 5.4, 'E', '9m Mid-West Road', '128.0 × 57.3 ft');
definePlot(43, 'F', -18.3, -16.5, 12.4, 5.4, 'E', '9m Mid-West Road', '128.0 × 57.3 ft');
definePlot(42, 'F', -18.6, -21.7, 13.0, 4.4, 'E', '9m Mid-West Road', '138.6 × 45.9 ft');
definePlot(41, 'F', -18.2, -26.3, 12.2, 4.4, 'E', '9m Mid-West Road', '128.0 × 45.9 ft');
definePlot(40, 'F', -17.6, -31.5, 11.0, 5.6, 'E', '9m Mid-West Road', '113.9 × 122.8 ft');
definePlot(59, 'F', -27.4, -13.6, 5.3, 10.8, 'S', '18m Cross Road', '55.5 × 114.5 ft');
definePlot(60, 'F', -33.4, -13.6, 6.0, 10.4, 'S', '18m Cross Road', '75.1 × 106.8 ft');

const SITE_OFFICE_DATA = {
  kind: 'office',
  id: 'site-office',
  title: 'Site & Sales Office',
  block: 'Entrance Plaza (Beside Main Gate)',
  x: 7.2, z: 32.5, w: 6.6, d: 9.0,
  dimText: '66.0 × 90.0 ft',
  approxSqFt: 5940,
  roadLabel: '18m Spine Entrance Plaza',
  status: 'Open Daily',
  unitType: 'Sales & Administrative Hub',
};

const MAIN_GATE_DATA = {
  kind: 'gate',
  id: 'main-gate',
  title: 'Main Dual-Portal Security Gate',
  block: '18m Spine Entrance',
  x: 14.0, z: 35.1, w: 7.4, d: 3.4,
  dimText: '60 Ft Wide Double Bay',
  approxSqFt: 2500,
  roadLabel: '18m Approach Road',
  status: '24×7 Manned',
  unitType: 'Heavy Commercial Entry/Exit',
};

const FACING_ROT = { S: 0, E: Math.PI / 2, N: Math.PI, W: -Math.PI / 2 };

/* ── 3. Batch Box Helper ── */
function buildBoxBatch(items, material, parent, castShadow = false, receiveShadow = true, geo = null) {
  if (!items.length) return null;
  const boxGeo = geo || new THREE.BoxGeometry(1, 1, 1);
  const im = new THREE.InstancedMesh(boxGeo, material, items.length);
  im.castShadow = castShadow;
  im.receiveShadow = receiveShadow;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const e = new THREE.Euler();
  items.forEach((it, i) => {
    p.set(it.x, it.y, it.z);
    e.set(it.rx || 0, it.ry || 0, it.rz || 0);
    q.setFromEuler(e);
    s.set(it.sx, it.sy, it.sz);
    m.compose(p, q, s);
    im.setMatrixAt(i, m);
  });
  im.instanceMatrix.needsUpdate = true;
  parent.add(im);
  return im;
}

export default function Park1Model3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [plotData, setPlotData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Shared 3D Scene Refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const plotPadIMRef = useRef(null);
  const statusBadgeIMRef = useRef(null);
  const selectBoxRef = useRef(null);
  const hoverBoxRef = useRef(null);
  const requestRenderRef = useRef(null);

  /* ── Fetch Real-time Plot Availability (Same Logic as InteractiveSiteMap) ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPlotData();
      setPlotData(data || {});
    } catch (err) {
      console.error('Error fetching live plot data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Compute Availability Stats ── */
  const stats = useMemo(() => {
    let available = 0;
    let sold = 0;
    let forLease = 0;
    let preLeased = 0;

    MASTER_PLOTS.forEach((p) => {
      const item = plotData[p.id];
      const status = (item?.status || 'available').toLowerCase();
      if (status === 'sold') sold++;
      else if (status === 'for-lease') forLease++;
      else if (status === 'pre-leased') preLeased++;
      else available++;
    });

    return {
      total: MASTER_PLOTS.length,
      available,
      sold,
      forLease,
      preLeased,
    };
  }, [plotData]);

  /* ── 3D Scene Initialization (Pure Architectural Models Only) ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'low-power',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? '#0f172a' : '#e6edf3');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.5,
      650
    );
    camera.position.set(58, 52, 82);
    cameraRef.current = camera;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 8;
    controls.maxDistance = 210;
    controls.target.set(-2, 0, 2);
    controlsRef.current = controls;

    // Lighting (Hemisphere + Sun)
    const hemiLight = new THREE.HemisphereLight(
      isDark ? '#1e293b' : '#f8fbff',
      isDark ? '#0f172a' : '#b8b2a6',
      isDark ? 0.8 : 0.95
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#fffbf2', isDark ? 1.05 : 1.25);
    sunLight.position.set(55, 78, 48);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 15;
    sunLight.shadow.camera.far = 220;
    const sb = 64;
    sunLight.shadow.camera.left = -sb;
    sunLight.shadow.camera.right = sb;
    sunLight.shadow.camera.top = sb;
    sunLight.shadow.camera.bottom = -sb;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);

    // Textures
    const brandAtlas = createMetroBrandAtlas();
    const logoTex = brandAtlas.clone();
    logoTex.needsUpdate = true;
    logoTex.repeat.set(0.5, 1);
    logoTex.offset.set(0, 0);

    const wallSignTex = brandAtlas.clone();
    wallSignTex.needsUpdate = true;
    wallSignTex.repeat.set(0.5, 1);
    wallSignTex.offset.set(0.5, 0);

    const shutterTex = createShutterTexture();
    const gableRoofGeo = createGableRoofGeo();
    const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Materials
    const MAT = {
      ground:        new THREE.MeshLambertMaterial({ color: isDark ? '#0f172a' : '#dce2e7' }),
      siteBase:      new THREE.MeshLambertMaterial({ color: isDark ? '#1e293b' : '#d0d5d9' }),
      asphalt:       new THREE.MeshLambertMaterial({ color: isDark ? '#334155' : '#47505a' }),
      curb:          new THREE.MeshLambertMaterial({ color: isDark ? '#475569' : '#cfd5db' }),
      roadDash:      new THREE.MeshLambertMaterial({ color: '#f8fafc' }),
      boundaryWall:  new THREE.MeshLambertMaterial({ color: isDark ? '#334155' : '#dcd7ce' }),
      plotPad:       new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      shedBody:      new THREE.MeshLambertMaterial({ color: isDark ? '#cbd5e1' : '#e5e1d8' }),
      shedRoof:      new THREE.MeshLambertMaterial({ color: isDark ? '#94a3b8' : '#d6dbe0' }),
      skylight:      new THREE.MeshLambertMaterial({ color: '#eef6fb' }),
      charcoalBand:  new THREE.MeshLambertMaterial({ color: '#334155' }),
      crimsonCanopy: new THREE.MeshLambertMaterial({ color: '#cc2936' }),
      shutter:       new THREE.MeshLambertMaterial({ map: shutterTex }),
      unitOffice:    new THREE.MeshLambertMaterial({ color: isDark ? '#e2e8f0' : '#ebe7df' }),
      officeAccent:  new THREE.MeshLambertMaterial({ color: '#475569' }),
      darkGlass:     new THREE.MeshLambertMaterial({ color: '#0f172a' }),
      apronWall:     new THREE.MeshLambertMaterial({ color: isDark ? '#475569' : '#d8d3ca' }),
      portalGrey:    new THREE.MeshLambertMaterial({ color: '#475569' }),
      gateGrey:      new THREE.MeshLambertMaterial({ color: '#334155' }),
      brightRed:     new THREE.MeshLambertMaterial({ color: '#dc2626' }),
      louverDark:    new THREE.MeshLambertMaterial({ color: '#1e293b' }),
      officeRear:    new THREE.MeshLambertMaterial({ color: isDark ? '#cbd5e1' : '#dad6ce' }),
      planterGreen:  new THREE.MeshLambertMaterial({ color: '#15803d' }),
      metroLogo:     new THREE.MeshLambertMaterial({ map: logoTex }),
      gateWallSign:  new THREE.MeshLambertMaterial({ map: wallSignTex }),
    };

    // Ground Plane
    const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), MAT.ground);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.14;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Site Footprint Polygon
    const siteShape = new THREE.Shape();
    siteShape.moveTo(-44.5, -36.5);
    siteShape.lineTo(-44.5, 4.5);
    siteShape.lineTo(-37.5, 19.5);
    siteShape.lineTo(-24.5, 36.5);
    siteShape.lineTo(-8.5, 37.5);
    siteShape.lineTo(17.5, 34.5);
    siteShape.lineTo(22.0, 48.0);
    siteShape.lineTo(35.0, 48.0);
    siteShape.lineTo(35.0, 30.5);
    siteShape.lineTo(33.0, 16.5);
    siteShape.lineTo(29.0, -35.2);
    siteShape.lineTo(-10.0, -39.2);
    siteShape.lineTo(-34.0, -37.2);
    siteShape.closePath();

    const sitePadGeo = new THREE.ShapeGeometry(siteShape);
    sitePadGeo.rotateX(-Math.PI / 2);
    const sitePad = new THREE.Mesh(sitePadGeo, MAT.siteBase);
    sitePad.position.y = -0.02;
    sitePad.receiveShadow = true;
    scene.add(sitePad);

    // Asphalt Roads
    const southRoadAngle = Math.atan2(10.8, 104);
    const roadBoxes = [
      { x: 0, y: 0.04, z: 41.2, sx: 118, sy: 0.12, sz: 6.0, ry: southRoadAngle },
      { x: 14.0, y: 0.05, z: 16.5, sx: 6.0, sy: 0.12, sz: 44.5 },
      { x: -7.5, y: 0.05, z: -5.0, sx: 49.0, sy: 0.12, sz: 5.8 },
      { x: -10.2, y: 0.05, z: 16.5, sx: 3.2, sy: 0.12, sz: 38.5 },
      { x: -30.2, y: 0.05, z: 16.0, sx: 3.2, sy: 0.12, sz: 37.0 },
      { x: -10.2, y: 0.05, z: -22.5, sx: 3.2, sy: 0.12, sz: 30.5 },
      { x: 15.4, y: 0.05, z: -20.5, sx: 3.2, sy: 0.12, sz: 27.5 },
      { x: 26.5, y: 0.05, z: -32.2, sx: 23.0, sy: 0.12, sz: 3.2 },
      { x: 38.5, y: 0.04, z: -38.0, sx: 4.4, sy: 0.12, sz: 20.0 },
    ];
    buildBoxBatch(roadBoxes, MAT.asphalt, scene, false, true, unitBoxGeo);

    // Road White Dashes
    const dashBoxes = [];
    for (let t = -52; t <= 52; t += 5.5) {
      const dx = Math.cos(southRoadAngle) * t;
      const dz = -Math.sin(southRoadAngle) * t;
      dashBoxes.push({ x: dx, y: 0.12, z: 41.2 + dz, sx: 2.2, sy: 0.02, sz: 0.22, ry: southRoadAngle });
    }
    for (let z = -1; z <= 33; z += 4.5) {
      dashBoxes.push({ x: 14.0, y: 0.12, z, sx: 0.22, sy: 0.02, sz: 2.0 });
    }
    for (let x = -28; x <= 11; x += 4.8) {
      dashBoxes.push({ x, y: 0.12, z: -5.0, sx: 2.0, sy: 0.02, sz: 0.22 });
    }
    buildBoxBatch(dashBoxes, MAT.roadDash, scene, false, false, unitBoxGeo);

    // Curbs & Perimeter Boundary Wall
    const curbWallBoxes = [
      { x: 10.9, y: 0.11, z: 16.0, sx: 0.28, sy: 0.16, sz: 36.2 },
      { x: 17.1, y: 0.11, z: 16.0, sx: 0.28, sy: 0.16, sz: 36.2 },
      { x: -10.0, y: 0.11, z: -2.0, sx: 42.0, sy: 0.16, sz: 0.28 },
      { x: -10.0, y: 0.11, z: -8.0, sx: 42.0, sy: 0.16, sz: 0.28 },
      { x: 23.0, y: 0.42, z: 35.2, sx: 11.4, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: 5.5, y: 0.42, z: 37.0, sx: 8.4, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: -3.8, y: 0.42, z: 38.0, sx: 10.2, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: -20.5, y: 0.42, z: 34.5, sx: 16.5, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: 28.6, y: 0.42, z: 8.5, sx: 0.35, sy: 0.85, sz: 51.0 },
      { x: 2.5, y: 0.42, z: -36.8, sx: 22.8, sy: 0.85, sz: 0.35 },
      { x: -18.5, y: 0.42, z: -35.6, sx: 13.0, sy: 0.85, sz: 0.35 },
      { x: -43.8, y: 0.42, z: 2.6, sx: 0.35, sy: 0.85, sz: 10.0 },
      { x: -40.2, y: 0.42, z: 19.8, sx: 0.35, sy: 0.85, sz: 23.0 },
    ];
    buildBoxBatch(curbWallBoxes, MAT.boundaryWall, scene, true, true, unitBoxGeo);

    // ── Build 63 Sheds & Plot Foundations ──
    const N = MASTER_PLOTS.length;
    const plotPadIM = new THREE.InstancedMesh(unitBoxGeo, MAT.plotPad, N);
    plotPadIM.receiveShadow = true;
    plotPadIMRef.current = plotPadIM;
    scene.add(plotPadIM);

    // Border lines around plots
    const borderPositions = [];

    // Shed structure instanced meshes
    const shedBodyIM   = new THREE.InstancedMesh(unitBoxGeo, MAT.shedBody, N);
    const shedRoofIM   = new THREE.InstancedMesh(gableRoofGeo, MAT.shedRoof, N);
    const unitOfficeIM = new THREE.InstancedMesh(unitBoxGeo, MAT.unitOffice, N);
    const skylightIM   = new THREE.InstancedMesh(unitBoxGeo, MAT.skylight, N * 2);
    shedBodyIM.castShadow = shedBodyIM.receiveShadow = true;
    shedRoofIM.castShadow = shedRoofIM.receiveShadow = true;
    unitOfficeIM.castShadow = unitOfficeIM.receiveShadow = true;

    // Facade details
    const charcoalBandIM = new THREE.InstancedMesh(unitBoxGeo, MAT.charcoalBand, N);
    const redCanopyIM    = new THREE.InstancedMesh(unitBoxGeo, MAT.crimsonCanopy, N);
    const shutterIM      = new THREE.InstancedMesh(unitBoxGeo, MAT.shutter, N);
    const officeBandIM   = new THREE.InstancedMesh(unitBoxGeo, MAT.officeAccent, N);
    const officeWinIM    = new THREE.InstancedMesh(unitBoxGeo, MAT.darkGlass, N * 2);
    const apronWallIM    = new THREE.InstancedMesh(unitBoxGeo, MAT.apronWall, N * 2);
    redCanopyIM.castShadow = true;

    // Roof status indicator bar
    const statusBadgeIM = new THREE.InstancedMesh(unitBoxGeo, MAT.plotPad, N);
    statusBadgeIMRef.current = statusBadgeIM;

    const mParent = new THREE.Matrix4();
    const mLocal  = new THREE.Matrix4();
    const mFinal  = new THREE.Matrix4();
    const vPos    = new THREE.Vector3();
    const vScale  = new THREE.Vector3();
    const qRot    = new THREE.Quaternion();
    const eRot    = new THREE.Euler();

    function setLocalInstance(im, idx, parentMat, lx, ly, lz, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
      vPos.set(lx, ly, lz);
      eRot.set(rx, ry, rz);
      qRot.setFromEuler(eRot);
      vScale.set(sx, sy, sz);
      mLocal.compose(vPos, qRot, vScale);
      mFinal.multiplyMatrices(parentMat, mLocal);
      im.setMatrixAt(idx, mFinal);
    }

    MASTER_PLOTS.forEach((plot, i) => {
      const rotY = FACING_ROT[plot.facing] || 0;
      const isEW = plot.facing === 'E' || plot.facing === 'W';
      const frontW = isEW ? plot.d : plot.w;
      const depthD = isEW ? plot.w : plot.d;

      vPos.set(plot.x, 0, plot.z);
      eRot.set(0, rotY, 0);
      qRot.setFromEuler(eRot);
      vScale.set(1, 1, 1);
      mParent.compose(vPos, qRot, vScale);

      // Pad
      setLocalInstance(plotPadIM, i, mParent, 0, 0.06, 0, frontW - 0.12, 0.12, depthD - 0.12);

      // Border Lines
      const hw = (plot.w - 0.1) / 2;
      const hd = (plot.d - 0.1) / 2;
      const yB = 0.14;
      const x0 = plot.x - hw, x1 = plot.x + hw;
      const z0 = plot.z - hd, z1 = plot.z + hd;
      borderPositions.push(
        x0, yB, z0,  x1, yB, z0,
        x1, yB, z0,  x1, yB, z1,
        x1, yB, z1,  x0, yB, z1,
        x0, yB, z1,  x0, yB, z0
      );

      // Shed dimensions
      const apronDepth = Math.min(1.55, depthD * 0.17);
      const shedW = frontW - 0.16;
      const shedD = depthD - apronDepth - 0.18;
      const shedZ = -apronDepth / 2;
      const eaveH = 2.85;
      const ridgeRise = 0.62;
      const flip = (Number(plot.id) % 2 === 0) ? 1 : -1;

      // Shed Body
      setLocalInstance(shedBodyIM, i, mParent, 0, 0.12 + eaveH / 2, shedZ, shedW, eaveH, shedD);

      // Roof
      setLocalInstance(shedRoofIM, i, mParent, 0, 0.12 + eaveH, shedZ, shedW + 0.14, ridgeRise, shedD + 0.16);

      // Skylights
      const roofAngle = Math.atan2(ridgeRise, (shedW + 0.14) / 2);
      const skyY = 0.12 + eaveH + ridgeRise * 0.52;
      const skyX = shedW * 0.25;
      setLocalInstance(skylightIM, i * 2,     mParent, -skyX, skyY, shedZ, 0.36, 0.05, shedD * 0.72, 0, 0,  roofAngle);
      setLocalInstance(skylightIM, i * 2 + 1, mParent,  skyX, skyY, shedZ, 0.36, 0.05, shedD * 0.72, 0, 0, -roofAngle);

      // 2-Storey Corner Unit Office
      const offW = Math.min(2.1, shedW * 0.34);
      const offH = 2.65;
      const offD = Math.min(1.65, apronDepth + 0.45);
      const offX = flip * (shedW / 2 - offW / 2);
      const offZ = shedZ + shedD / 2 + offD / 2 - 0.32;
      setLocalInstance(unitOfficeIM, i, mParent, offX, 0.12 + offH / 2, offZ, offW, offH, offD);

      // Facade Accents
      const bandH = 0.92;
      setLocalInstance(charcoalBandIM, i, mParent, 0, 0.12 + eaveH - bandH / 2 - 0.08, shedZ, shedW + 0.05, bandH, shedD + 0.05);

      const canopyW = shedW - offW - 0.05;
      const canopyX = -flip * (offW / 2);
      const frontZ  = shedZ + shedD / 2;
      setLocalInstance(redCanopyIM, i, mParent, canopyX, 0.12 + 1.98, frontZ + 0.28, canopyW, 0.24, 0.62);

      const shutW = Math.min(2.1, canopyW * 0.66);
      const shutH = 1.82;
      setLocalInstance(shutterIM, i, mParent, canopyX, 0.12 + shutH / 2, frontZ + 0.05, shutW, shutH, 0.08);

      setLocalInstance(officeBandIM, i, mParent, offX, 0.12 + offH / 2, offZ + offD / 2 + 0.02, offW * 0.44, offH - 0.04, 0.06);

      const winW = offW * 0.36;
      setLocalInstance(officeWinIM, i * 2,     mParent, offX, 0.12 + 0.72, offZ + offD / 2 + 0.05, winW, 0.64, 0.05);
      setLocalInstance(officeWinIM, i * 2 + 1, mParent, offX, 0.12 + 1.88, offZ + offD / 2 + 0.05, winW, 0.64, 0.05);

      const wallZ = frontZ + apronDepth * 0.45;
      setLocalInstance(apronWallIM, i * 2,     mParent, -shedW / 2 + 0.06, 0.12 + 0.28, wallZ, 0.1, 0.56, apronDepth * 0.9);
      setLocalInstance(apronWallIM, i * 2 + 1, mParent,  shedW / 2 - 0.06, 0.12 + 0.28, wallZ, 0.1, 0.56, apronDepth * 0.9);

      // Roof Status Badge
      vPos.set(plot.x, 3.65, plot.z);
      eRot.set(0, rotY, 0);
      qRot.setFromEuler(eRot);
      vScale.set(Math.min(2.4, frontW * 0.45), 0.16, Math.min(2.0, depthD * 0.25));
      mFinal.compose(vPos, qRot, vScale);
      statusBadgeIM.setMatrixAt(i, mFinal);
    });

    [
      plotPadIM,
      shedBodyIM,
      shedRoofIM,
      unitOfficeIM,
      skylightIM,
      charcoalBandIM,
      redCanopyIM,
      shutterIM,
      officeBandIM,
      officeWinIM,
      apronWallIM,
      statusBadgeIM,
    ].forEach((im) => {
      im.instanceMatrix.needsUpdate = true;
      scene.add(im);
    });

    // Plot Border Lines
    const borderGeo = new THREE.BufferGeometry();
    borderGeo.setAttribute('position', new THREE.Float32BufferAttribute(borderPositions, 3));
    const borderLines = new THREE.LineSegments(
      borderGeo,
      new THREE.LineBasicMaterial({
        color: isDark ? '#64748b' : '#94a3b8',
        transparent: true,
        opacity: 0.7,
      })
    );
    scene.add(borderLines);

    // ── Build Metro Site Office Model ──
    const officeGroup = new THREE.Group();
    officeGroup.position.set(7.2, 0.14, 32.5);
    officeGroup.rotation.y = Math.PI / 2;

    const officePad = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 9.0), MAT.curb);
    officePad.position.set(7.2, 0.07, 32.5);
    officePad.receiveShadow = true;
    scene.add(officePad);

    const offRear = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.7, 3.6), MAT.officeRear);
    offRear.position.set(0, 1.35, -0.8);
    offRear.castShadow = offRear.receiveShadow = true;
    officeGroup.add(offRear);

    // Enclosing side walls (South wall facing highway and North wall facing park)
    const offSideWalls = [
      // South side wall (local -x, facing world +z / highway & boundary wall)
      { x: -3.4, y: 1.35, z: 0.1, sx: 0.28, sy: 2.7, sz: 1.8 },
      { x: -3.4, y: 2.72, z: -0.8, sx: 0.32, sy: 0.12, sz: 3.6 },
      // North side wall (local +x, facing world -z / park interior)
      { x: 3.4, y: 1.35, z: 0.1, sx: 0.28, sy: 2.7, sz: 1.8 },
      { x: 3.4, y: 2.72, z: -0.8, sx: 0.32, sy: 0.12, sz: 3.6 },
    ];
    buildBoxBatch(offSideWalls, MAT.officeRear, officeGroup, true, true, unitBoxGeo);

    // Highway-facing exterior sign plaque on the south wall (local -x, facing world +z towards highway)
    const highwaySign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), MAT.metroLogo);
    highwaySign.rotation.y = -Math.PI / 2;
    highwaySign.position.set(-3.56, 1.8, -0.8);
    officeGroup.add(highwaySign);

    const offPortalShell = [
      { x: -1.35, y: 1.8, z: 1.2, sx: 0.32, sy: 3.6, sz: 0.9 },
      { x:  1.35, y: 1.8, z: 1.2, sx: 0.32, sy: 3.6, sz: 0.9 },
      { x:  0.0,  y: 3.44, z: 1.2, sx: 3.02, sy: 0.32, sz: 0.9 },
    ];
    buildBoxBatch(offPortalShell, MAT.portalGrey, officeGroup, true, true, unitBoxGeo);

    const portalLouver = new THREE.Mesh(new THREE.BoxGeometry(2.38, 1.8, 0.16), MAT.metroLogo);
    portalLouver.position.set(0, 2.38, 1.32);
    officeGroup.add(portalLouver);

    const offGlassBoxes = [
      { x: 0,    y: 0.78, z: 1.0, sx: 2.2, sy: 1.56, sz: 0.12 },
      { x: -2.6, y: 1.15, z: 0.95, sx: 2.3, sy: 2.2, sz: 0.14 },
      { x:  2.6, y: 1.15, z: 0.95, sx: 2.3, sy: 2.2, sz: 0.14 },
    ];
    buildBoxBatch(offGlassBoxes, MAT.darkGlass, officeGroup, false, false, unitBoxGeo);

    const greyFinBoxes = [
      { x: -3.95, y: 1.28, z: 1.15, sx: 0.28, sy: 2.56, sz: 0.52 },
      { x: -3.22, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x: -2.42, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x: -1.78, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x:  1.78, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x:  2.42, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x:  3.22, y: 1.28, z: 1.15, sx: 0.24, sy: 2.56, sz: 0.52 },
      { x:  3.95, y: 1.28, z: 1.15, sx: 0.28, sy: 2.56, sz: 0.52 },
    ];
    buildBoxBatch(greyFinBoxes, MAT.portalGrey, officeGroup, true, true, unitBoxGeo);

    const redFinBoxes = [
      { x: -3.58, y: 1.26, z: 1.08, sx: 0.26, sy: 2.52, sz: 0.32 },
      { x: -2.82, y: 1.26, z: 1.08, sx: 0.26, sy: 2.52, sz: 0.32 },
      { x:  2.82, y: 1.26, z: 1.08, sx: 0.26, sy: 2.52, sz: 0.32 },
      { x:  3.58, y: 1.26, z: 1.08, sx: 0.26, sy: 2.52, sz: 0.32 },
    ];
    buildBoxBatch(redFinBoxes, MAT.brightRed, officeGroup, false, true, unitBoxGeo);

    const planterBoxes = [
      { x: -2.85, y: 0.14, z: 1.72, sx: 2.5, sy: 0.28, sz: 0.62 },
      { x:  2.85, y: 0.14, z: 1.72, sx: 2.5, sy: 0.28, sz: 0.62 },
    ];
    buildBoxBatch(planterBoxes, MAT.planterGreen, officeGroup, false, true, unitBoxGeo);

    scene.add(officeGroup);

    // Site office hit box
    const siteOfficeHit = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 3.8, 9.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    siteOfficeHit.position.set(7.2, 1.9, 32.5);
    siteOfficeHit.userData.entity = SITE_OFFICE_DATA;
    scene.add(siteOfficeHit);

    // ── Build Main Dual-Portal Security Gate Model ──
    const gateGroup = new THREE.Group();
    gateGroup.position.set(14.0, 0.12, 35.1);

    const gateIsland = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 2.8), MAT.curb);
    gateIsland.position.set(14.0, 0.07, 35.1);
    scene.add(gateIsland);

    const gateShellBoxes = [
      { x: -3.25, y: 1.45, z: 0, sx: 0.42, sy: 2.9, sz: 1.7 },
      { x: -0.78, y: 1.45, z: 0, sx: 0.34, sy: 2.9, sz: 1.5 },
      { x: -2.02, y: 2.78, z: 0, sx: 2.88, sy: 0.34, sz: 1.7 },
      { x:  0.78, y: 1.62, z: 0, sx: 0.34, sy: 3.24, sz: 1.5 },
      { x:  3.25, y: 1.62, z: 0, sx: 0.42, sy: 3.24, sz: 1.7 },
      { x:  2.02, y: 3.10, z: 0, sx: 2.88, sy: 0.34, sz: 1.7 },
      { x: 0, y: 0.72, z: 0, sx: 1.24, sy: 1.44, sz: 1.65 },
      { x: 0, y: 2.48, z: 0, sx: 1.28, sy: 1.15, sz: 1.15 },
    ];
    buildBoxBatch(gateShellBoxes, MAT.gateGrey, gateGroup, true, true, unitBoxGeo);

    const gateRedBoxes = [
      { x: -3.02, y: 1.38, z: 0.05, sx: 0.12, sy: 2.65, sz: 1.55 },
      { x: -2.02, y: 2.60, z: 0.05, sx: 2.42, sy: 0.12, sz: 1.55 },
      { x: -3.47, y: 1.42, z: 0.35, sx: 0.08, sy: 2.75, sz: 0.25 },
      { x:  3.02, y: 1.55, z: 0.05, sx: 0.12, sy: 2.95, sz: 1.55 },
      { x:  2.02, y: 2.92, z: 0.05, sx: 2.42, sy: 0.12, sz: 1.55 },
      { x:  3.47, y: 1.58, z: 0.35, sx: 0.08, sy: 3.05, sz: 0.25 },
      { x:  0,    y: 1.52, z: 0.05, sx: 1.48, sy: 0.32, sz: 1.85 },
      { x: -1.45, y: 1.22, z: 0.72, sx: 1.85, sy: 0.08, sz: 0.08, rz: -0.68 },
      { x:  1.95, y: 0.62, z: 0.72, sx: 2.05, sy: 0.08, sz: 0.08 },
    ];
    buildBoxBatch(gateRedBoxes, MAT.brightRed, gateGroup, false, true, unitBoxGeo);

    const gateLogoF = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.98), MAT.metroLogo);
    gateLogoF.position.set(0, 2.48, 0.59);
    const gateLogoB = gateLogoF.clone();
    gateLogoB.rotation.y = Math.PI;
    gateLogoB.position.z = -0.59;
    gateGroup.add(gateLogoF, gateLogoB);

    const signWall = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.45, 0.34), MAT.boundaryWall);
    signWall.position.set(-4.35, 0.72, 0.72);
    const signFace = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 1.25), MAT.gateWallSign);
    signFace.position.set(-4.35, 0.74, 0.90);
    gateGroup.add(signWall, signFace);

    scene.add(gateGroup);

    // Gate Hit Box
    const mainGateHit = new THREE.Mesh(
      new THREE.BoxGeometry(7.8, 3.6, 3.4),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    mainGateHit.position.set(14.0, 1.8, 35.1);
    mainGateHit.userData.entity = MAIN_GATE_DATA;
    scene.add(mainGateHit);

    // Wireframe Highlighters
    const highlightGeo = new THREE.EdgesGeometry(unitBoxGeo);
    const hoverBox = new THREE.LineSegments(
      highlightGeo,
      new THREE.LineBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.85 })
    );
    hoverBox.visible = false;
    scene.add(hoverBox);
    hoverBoxRef.current = hoverBox;

    const selectBox = new THREE.LineSegments(
      highlightGeo,
      new THREE.LineBasicMaterial({ color: '#cc2936' })
    );
    selectBox.visible = false;
    scene.add(selectBox);
    selectBoxRef.current = selectBox;

    // ── Render on demand Loop ──
    let isRafRunning = false;
    let needsRender = true;
    const prevCamPos = new THREE.Vector3();
    const prevTargetPos = new THREE.Vector3();

    const requestRender = () => {
      needsRender = true;
      if (!isRafRunning) {
        isRafRunning = true;
        requestAnimationFrame(tick);
      }
    };
    requestRenderRef.current = requestRender;

    function tick() {
      let stillMoving = false;
      prevCamPos.copy(camera.position);
      prevTargetPos.copy(controls.target);
      controls.update();

      const camMoved =
        prevCamPos.distanceToSquared(camera.position) > 1e-6 ||
        prevTargetPos.distanceToSquared(controls.target) > 1e-6;
      if (camMoved) stillMoving = true;

      if (needsRender || stillMoving) {
        renderer.render(scene, camera);
        needsRender = false;
      }

      if (stillMoving) {
        requestAnimationFrame(tick);
      } else {
        isRafRunning = false;
      }
    }

    controls.addEventListener('change', requestRender);

    // Initial shadow render
    renderer.shadowMap.needsUpdate = true;
    requestRender();

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      requestRender();
    });
    resizeObserver.observe(container);

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPt = { x: 0, y: 0 };

    const pickEntity = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const targets = [siteOfficeHit, mainGateHit, shedBodyIM, shedRoofIM, plotPadIM];
      const hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return null;

      const hit = hits[0];
      if (hit.object.userData.entity) return hit.object.userData.entity;
      if (hit.instanceId !== undefined && MASTER_PLOTS[hit.instanceId]) {
        return MASTER_PLOTS[hit.instanceId];
      }
      return null;
    };

    const handlePointerMove = (e) => {
      const entity = pickEntity(e.clientX, e.clientY);
      setHoveredEntity(entity);
      if (entity) {
        renderer.domElement.style.cursor = 'pointer';
        hoverBox.position.set(entity.x, 2.0, entity.z);
        hoverBox.scale.set(entity.w + 0.3, 3.8, entity.d + 0.3);
        hoverBox.visible = true;
      } else {
        renderer.domElement.style.cursor = 'grab';
        hoverBox.visible = false;
      }
      requestRender();
    };

    const handlePointerDown = (e) => {
      downPt = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      if (Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 6) return;
      const entity = pickEntity(e.clientX, e.clientY);
      if (entity) {
        setSelectedEntity(entity);
        selectBox.position.set(entity.x, 2.0, entity.z);
        selectBox.scale.set(entity.w + 0.35, 3.85, entity.d + 0.35);
        selectBox.visible = true;
        requestRender();
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  /* ── Synchronize Live Plot Status Colors onto 3D Models ── */
  useEffect(() => {
    const plotPadIM = plotPadIMRef.current;
    const statusBadgeIM = statusBadgeIMRef.current;
    const requestRender = requestRenderRef.current;
    if (!plotPadIM || !statusBadgeIM) return;

    const tmpColor = new THREE.Color();
    MASTER_PLOTS.forEach((plot, i) => {
      const item = plotData[plot.id];
      const status = (item?.status || 'available').toLowerCase();

      // Check if filter is applied
      let isVisible = true;
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'AVAILABLE' && status !== 'available') isVisible = false;
        if (statusFilter === 'SOLD' && status !== 'sold') isVisible = false;
        if (statusFilter === 'LEASE' && status !== 'for-lease') isVisible = false;
      }

      const hex = isVisible ? getStatusColorHex(status) : '#334155';
      tmpColor.set(hex);
      plotPadIM.setColorAt(i, tmpColor);
      statusBadgeIM.setColorAt(i, tmpColor);
    });

    if (plotPadIM.instanceColor) plotPadIM.instanceColor.needsUpdate = true;
    if (statusBadgeIM.instanceColor) statusBadgeIM.instanceColor.needsUpdate = true;
    if (requestRender) requestRender();
  }, [plotData, statusFilter]);

  /* ── Camera Reset Helper ── */
  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !requestRenderRef.current) return;
    cameraRef.current.position.set(58, 52, 82);
    controlsRef.current.target.set(-2, 0, 2);
    controlsRef.current.update();
    requestRenderRef.current();
  }, []);

  /* ── Focus Camera on Selected Plot ── */
  const focusOnEntity = useCallback((entity) => {
    if (!cameraRef.current || !controlsRef.current || !requestRenderRef.current || !entity) return;
    const target = new THREE.Vector3(entity.x, 1.5, entity.z);
    controlsRef.current.target.copy(target);
    cameraRef.current.position.set(entity.x + 16, 14, entity.z + 16);
    controlsRef.current.update();
    requestRenderRef.current();
  }, []);

  /* ── Toggle Fullscreen ── */
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Sync selected plot info
  const selectedPlotInfo = useMemo(() => {
    if (!selectedEntity) return null;
    if (selectedEntity.kind === 'plot') {
      const live = plotData[selectedEntity.id] || {};
      const status = (live.status || 'available').toLowerCase();
      const area = live.area || selectedEntity.dimText;
      return {
        ...selectedEntity,
        status,
        area,
        owner: live.owner || '',
        lessee: live.lessee || '',
        monthlyRent: live.monthlyRent || '',
      };
    }
    return selectedEntity;
  }, [selectedEntity, plotData]);

  const whatsappMessage = selectedPlotInfo
    ? encodeURIComponent(
        `Hello, I would like to inquire about ${
          selectedPlotInfo.kind === 'plot' ? `Plot #${selectedPlotInfo.id}` : selectedPlotInfo.title
        } at Metro Industrial Park (MIP 1). Please share availability and pricing details.`
      )
    : '';

  return (
    <div className="relative w-full flex flex-col h-[62svh] min-h-[420px] sm:h-[68svh] sm:min-h-[580px] select-none">
      {/* ── Single-Line 3D Controls Bar ── */}
      <div
        className={`px-2.5 sm:px-3.5 py-2 border-b transition-colors z-10 flex items-center justify-between gap-2 ${
          isDark ? 'border-white/[0.12] bg-[#121215]/95 backdrop-blur-md' : 'border-gray-200 bg-white/95 backdrop-blur-md'
        }`}
      >
        <span className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-wider truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Interactive 3D · 63 Sheds
        </span>

        {/* Right: Actions (Edit, Sync, Reset View, Fullscreen) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={ADMIN_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`h-7 px-2 border inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              isDark
                ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Edit Inventory on Google Sheet"
          >
            <ExternalLink size={11} />
            <span>Edit</span>
          </a>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className={`h-7 px-2 border inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark
                ? 'bg-[#0B0B0D] text-gray-300 hover:text-white border-white/[0.12]'
                : 'bg-[#F8F9FA] text-gray-700 hover:text-gray-900 border-gray-200'
            }`}
            title="Sync Live Data"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-brand-red' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            type="button"
            onClick={resetCamera}
            className={`h-7 px-2 border inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              isDark
                ? 'bg-[#0B0B0D] text-gray-300 hover:text-white border-white/[0.12]'
                : 'bg-[#F8F9FA] text-gray-700 hover:text-gray-900 border-gray-200'
            }`}
            title="Reset Camera View"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="h-7 px-2.5 bg-brand-red hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap transition-colors"
            title="Toggle Fullscreen 3D View"
          >
            {isFullscreen ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* ── Single-Row Compact Filterable Availability Ledger ── */}
      <div
        className={`border-b grid grid-cols-5 divide-x text-center ${
          isDark ? 'border-white/[0.12] divide-white/[0.12] bg-[#0B0B0D]' : 'border-gray-200 divide-gray-200 bg-[#F8F9FA]'
        }`}
      >
        {[
          { key: 'ALL', val: stats.total, label: 'All Units', accent: 'text-white', accentLight: 'text-gray-900', bar: '#E11D48' },
          { key: 'AVAILABLE', val: stats.available, label: 'Available', accent: 'text-emerald-400', accentLight: 'text-emerald-600', bar: '#10B981' },
          { key: 'SOLD', val: stats.sold, label: 'Sold', accent: 'text-gray-300', accentLight: 'text-gray-700', bar: '#6B7280' },
          { key: 'LEASE', val: stats.forLease, label: 'For Lease', accent: 'text-red-400', accentLight: 'text-brand-red', bar: '#EF4444' },
          { key: 'PRELEASE', val: stats.preLeased, label: 'Pre-Leased', accent: 'text-blue-400', accentLight: 'text-blue-600', bar: '#3B82F6', readOnly: true },
        ].map((item) => {
          const active = !item.readOnly && statusFilter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              disabled={item.readOnly}
              onClick={() => !item.readOnly && setStatusFilter(item.key)}
              className={`py-1.5 px-1 transition-colors flex flex-col items-center justify-center min-w-0 ${
                item.readOnly ? 'cursor-default' : 'cursor-pointer'
              } ${active ? (isDark ? 'bg-white/[0.08]' : 'bg-white') : ''}`}
              style={active ? { boxShadow: `inset 0 -2px 0 0 ${item.bar}` } : undefined}
            >
              <span className={`text-xs sm:text-sm font-bold tabular-nums leading-none ${isDark ? item.accent : item.accentLight}`}>
                {item.val}
              </span>
              <span className={`font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-wider mt-0.5 truncate max-w-full ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 3D Viewport Host (Canvas Only) ── */}
      <div className="relative flex-1 w-full h-full min-h-[300px]">
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />

        {/* Orbit Hint Watermark */}
        <div className="absolute bottom-3 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
          <Compass size={13} className="text-brand-red animate-spin-slow" />
          <span>Drag to Orbit · Scroll / Pinch to Zoom · Click Shed to Inspect</span>
        </div>

        {/* Floating Minimal Hover Tooltip */}
        {hoveredEntity && !selectedEntity && (
          <div className="absolute top-3 left-3 pointer-events-none z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/15 shadow-xl">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  hoveredEntity.kind === 'plot'
                    ? getStatusColorHex(plotData[hoveredEntity.id]?.status)
                    : '#cc2936',
              }}
            />
            <span>{hoveredEntity.title}</span>
            <span className="text-slate-400 font-normal">
              {hoveredEntity.kind === 'plot'
                ? `${hoveredEntity.dimText} · ${getStatusLabel(plotData[hoveredEntity.id]?.status)}`
                : hoveredEntity.block}
            </span>
          </div>
        )}

        {/* Click Inspector Drawer Card */}
        {selectedPlotInfo && (
          <aside
            className={`absolute bottom-3 right-3 sm:top-3 sm:bottom-auto z-30 w-[calc(100%-1.5rem)] sm:w-80 rounded-2xl p-4 sm:p-5 border shadow-2xl backdrop-blur-xl transition-all ${
              isDark
                ? 'bg-gray-900/95 border-gray-700 text-white shadow-black/80'
                : 'bg-white/95 border-gray-200 text-gray-900 shadow-slate-300/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-200/50 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium sm:font-semibold uppercase tracking-wider ${getStatusBadgeClass(
                      selectedPlotInfo.status
                    )}`}
                  >
                    {getStatusLabel(selectedPlotInfo.status)}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    {selectedPlotInfo.block}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium sm:font-semibold tracking-tight">
                  {selectedPlotInfo.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Metro Industrial Park (MIP 1), Moraiya
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedEntity(null);
                  if (selectBoxRef.current) selectBoxRef.current.visible = false;
                  if (requestRenderRef.current) requestRenderRef.current();
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="p-2.5 rounded-xl border bg-slate-500/5 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-medium text-gray-400 uppercase block">
                  Dimensions
                </span>
                <span className="font-medium sm:font-semibold mt-0.5 block">{selectedPlotInfo.dimText}</span>
              </div>

              <div className="p-2.5 rounded-xl border bg-slate-500/5 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-medium text-gray-400 uppercase block">
                  Approx. Area
                </span>
                <span className="font-medium sm:font-semibold text-brand-red mt-0.5 block">
                  {selectedPlotInfo.area || `${selectedPlotInfo.approxSqFt?.toLocaleString()} SQ.FT`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border bg-slate-500/5 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-medium text-gray-400 uppercase block">
                  Road Facing
                </span>
                <span className="font-medium sm:font-semibold mt-0.5 block">{selectedPlotInfo.roadLabel}</span>
              </div>

              <div className="p-2.5 rounded-xl border bg-slate-500/5 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-medium text-gray-400 uppercase block">
                  Unit Type
                </span>
                <span className="font-medium sm:font-semibold mt-0.5 block">{selectedPlotInfo.unitType}</span>
              </div>
            </div>

            {/* Compact Spec Tags */}
            <div className={`flex flex-wrap gap-1.5 mb-3 text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {['60 Ft RCC', '30–35 Ft Clear', 'VDF Floor', 'CCTV · Weighbridge'].map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 border ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-gray-200 bg-gray-50'}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium sm:font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-green-600/25 active:scale-95 transition-all whitespace-nowrap"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:919824235642"
                className={`py-2 px-3 rounded-xl font-medium sm:font-semibold text-xs flex items-center justify-center gap-1.5 border transition-all active:scale-95 whitespace-nowrap ${
                  isDark
                    ? 'border-gray-700 text-gray-200 hover:border-brand-red'
                    : 'border-gray-200 text-gray-700 hover:border-brand-red'
                }`}
              >
                <Phone size={13} />
                <span>Call</span>
              </a>

              <button
                type="button"
                onClick={() => focusOnEntity(selectedPlotInfo)}
                className={`py-2 px-2.5 rounded-xl font-medium sm:font-semibold text-xs flex items-center justify-center border transition-all active:scale-95 ${
                  isDark
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                title="Focus Camera on Plot"
              >
                <Compass size={14} />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
