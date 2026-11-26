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
  Search,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getPlotData } from '../../services/dataService';
import UnitDetailModal from './UnitDetailModal';
import {
  PARK1_ADMIN_SHEET_URL,
  PARK1_PLOT_ENTRIES,
  normalizePark1Status,
  getPark1StatusHex,
  computePark1Stats,
  getPark1StatItems,
  getPark1HoverSummary,
  buildPark1ModalProps,
} from '../../utils/park1UnitData';

/* ── 1. Brand Logo, Entrance Sign, & Plot Number Badge Textures ── */
function drawLouverBackdrop(ctx, w, h) {
  ctx.fillStyle = '#3a3837';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#2b2928';
  for (let x = 8; x < w; x += 14) {
    ctx.fillRect(x, 0, 5, h);
  }
}

function createMetroLogoTexture(onLoadReady) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  drawLouverBackdrop(ctx, 256, 256);

  // Subtle METRO wordmark immediately while real /MDLogo-dark.png loads
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 32px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('METRO', 128, 214);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;

  if (typeof Image !== 'undefined') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawLouverBackdrop(ctx, 256, 256);
      const maxW = 196;
      const maxH = 148;
      const scale = Math.min(maxW / (img.naturalWidth || 196), maxH / (img.naturalHeight || 148));
      const dw = (img.naturalWidth || maxW) * scale;
      const dh = (img.naturalHeight || maxH) * scale;
      ctx.drawImage(img, (256 - dw) / 2, (176 - dh) / 2, dw, dh);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 30px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('METRO', 128, 214);

      tex.needsUpdate = true;
      onLoadReady?.();
    };
    img.onerror = () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = '/MDLogo.png';
      }
    };
    img.src = '/MDLogo-dark.png';
  }

  return tex;
}

function createGateSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext('2d');

  // Warm concrete stone monolith matching boundary wall
  ctx.fillStyle = '#dad4ca';
  ctx.fillRect(0, 0, 512, 320);

  // Architectural recessed seam lines
  ctx.fillStyle = '#b9b2a7';
  ctx.fillRect(0, 14, 512, 5);
  ctx.fillRect(0, 301, 512, 5);

  ctx.fillStyle = '#cc2936';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 66px Inter, system-ui, sans-serif';
  ctx.fillText('METRO', 256, 86);
  ctx.font = '800 54px Inter, system-ui, sans-serif';
  ctx.fillText('INDUSTRIAL', 256, 162);
  ctx.font = '900 64px Inter, system-ui, sans-serif';
  ctx.fillText('PARK', 256, 238);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function drawPlotNumberBadge(canvas, label, statusHex, dimmed) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pad = 6;
  const r = 18;
  const rw = w - pad * 2;
  const rh = h - pad * 2;

  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(pad + rw - r, pad);
  ctx.quadraticCurveTo(pad + rw, pad, pad + rw, pad + r);
  ctx.lineTo(pad + rw, pad + rh - r);
  ctx.quadraticCurveTo(pad + rw, pad + rh, pad + rw - r, pad + rh);
  ctx.lineTo(pad + r, pad + rh);
  ctx.quadraticCurveTo(pad, pad + rh, pad, pad + rh - r);
  ctx.lineTo(pad, pad + r);
  ctx.quadraticCurveTo(pad, pad, pad + r, pad);
  ctx.closePath();
  ctx.fillStyle = dimmed ? '#1e293b' : statusHex;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = dimmed ? 'rgba(148,163,184,0.45)' : '#ffffff';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 46px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(label), w / 2, h / 2 + 2);
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

  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
  const plotSpritesRef = useRef([]);
  const selectBoxRef = useRef(null);
  const hoverBoxRef = useRef(null);
  const requestRenderRef = useRef(null);

  /* ── Fetch Real-time Plot Availability (Exact Sync Logic as 2D) ── */
  const loadData = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPlotData(forceRefresh);
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        PARK1_PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error fetching live plot data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false, false);
    const id = setInterval(() => loadData(true, true), 30000);
    return () => clearInterval(id);
  }, [loadData]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  /* ── Compute Availability Stats (Canonical Order Matching 2D) ── */
  const stats = useMemo(() => computePark1Stats(plotData), [plotData]);
  const statItems = useMemo(() => getPark1StatItems(stats, isDark), [stats, isDark]);

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
    let requestRenderFn = () => {};
    const logoTex = createMetroLogoTexture(() => requestRenderFn());
    const wallSignTex = createGateSignTexture();

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

    // Curbs & Perimeter Boundary Wall (seamlessly connecting Gate <-> SE/SW Outer Walls)
    const eastWallAngle = Math.atan2(1.17, 11.35);
    const curbWallBoxes = [
      { x: 10.9, y: 0.11, z: 16.0, sx: 0.28, sy: 0.16, sz: 36.2 },
      { x: 17.1, y: 0.11, z: 16.0, sx: 0.28, sy: 0.16, sz: 36.2 },
      { x: -10.0, y: 0.11, z: -2.0, sx: 42.0, sy: 0.16, sz: 0.28 },
      { x: -10.0, y: 0.11, z: -8.0, sx: 42.0, sy: 0.16, sz: 0.28 },
      // East wing wall flush from Right Gate Pillar (17.25, 35.10) to East Boundary corner (28.60, 33.93)
      { x: 22.92, y: 0.42, z: 34.52, sx: 11.45, sy: 0.85, sz: 0.35, ry: eastWallAngle },
      // West wing wall flush up to (8.60, 36.68) where Metro Industrial Park wall connects it to Left Gate Pillar
      { x: 4.90, y: 0.42, z: 37.06, sx: 7.50, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: -3.8, y: 0.42, z: 38.0, sx: 10.2, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: -20.5, y: 0.42, z: 34.5, sx: 16.5, sy: 0.85, sz: 0.35, ry: southRoadAngle },
      { x: 28.6, y: 0.42, z: 8.55, sx: 0.35, sy: 0.85, sz: 51.1 },
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

    // ── Floating Plot Numbers Above All 63 3D Sheds ──
    const plotLabelGroup = new THREE.Group();
    const plotSprites = MASTER_PLOTS.map((plot) => {
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 96;
      badgeCanvas.height = 72;
      drawPlotNumberBadge(badgeCanvas, plot.id, getPark1StatusHex('available'), false);

      const badgeTex = new THREE.CanvasTexture(badgeCanvas);
      badgeTex.colorSpace = THREE.SRGBColorSpace;
      badgeTex.minFilter = THREE.LinearFilter;

      const badgeMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(badgeMat);
      sprite.position.set(plot.x, 4.75, plot.z);
      sprite.scale.set(2.6, 1.9, 1);
      sprite.userData.entity = plot;
      plotLabelGroup.add(sprite);

      return {
        id: plot.id,
        canvas: badgeCanvas,
        tex: badgeTex,
        mat: badgeMat,
        sprite,
        lastKey: '',
      };
    });
    scene.add(plotLabelGroup);
    plotSpritesRef.current = plotSprites;

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
    const highwaySign = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.15), MAT.metroLogo);
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
      { x: -2.25, y: 0.14, z: 1.72, sx: 1.4, sy: 0.28, sz: 0.62 },
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

    // Sign Wall connecting Outer Boundary Wall (world 8.65, 36.68 -> local -5.35, 1.58)
    // seamlessly to Left Gate Pillar front face (world 10.68, 35.68 -> local -3.32, 0.58)
    // with "METRO INDUSTRIAL PARK" front face unobstructed and oriented toward South-East (+X, +Z).
    const signWallGroup = new THREE.Group();
    signWallGroup.position.set(-4.335, 0, 1.08);
    signWallGroup.rotation.y = Math.atan2(1.00, 2.03);

    const signWallBody = new THREE.Mesh(new THREE.BoxGeometry(2.40, 1.65, 0.38), MAT.boundaryWall);
    signWallBody.position.set(0, 0.825, 0);
    signWallBody.castShadow = signWallBody.receiveShadow = true;

    const signWallCap = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.10, 0.44), MAT.portalGrey);
    signWallCap.position.set(0, 1.68, 0);

    const signWallPier = new THREE.Mesh(new THREE.BoxGeometry(0.40, 1.74, 0.44), MAT.boundaryWall);
    signWallPier.position.set(-1.12, 0.87, 0);
    signWallPier.castShadow = signWallPier.receiveShadow = true;

    const signFace = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.24), MAT.gateWallSign);
    signFace.position.set(0.06, 0.88, 0.20);

    signWallGroup.add(signWallBody, signWallCap, signWallPier, signFace);
    gateGroup.add(signWallGroup);

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
    requestRenderFn = requestRender;
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

      const targets = [
        siteOfficeHit,
        mainGateHit,
        shedBodyIM,
        shedRoofIM,
        plotPadIM,
        ...plotSprites.map((s) => s.sprite),
      ];
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
      plotSprites.forEach((s) => {
        s.tex.dispose();
        s.mat.dispose();
      });
      plotSpritesRef.current = [];
      logoTex.dispose();
      wallSignTex.dispose();
      shutterTex.dispose();
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
    const plotSprites = plotSpritesRef.current;

    MASTER_PLOTS.forEach((plot, i) => {
      const item = plotData[plot.id];
      const status = normalizePark1Status(item?.status);
      const isVisible = statusFilter === 'ALL' || status === statusFilter;

      const hex = isVisible ? getPark1StatusHex(status) : '#334155';
      tmpColor.set(hex);
      plotPadIM.setColorAt(i, tmpColor);
      statusBadgeIM.setColorAt(i, tmpColor);

      const badge = plotSprites[i];
      if (badge) {
        const badgeKey = `${hex}-${isVisible ? 1 : 0}`;
        if (badge.lastKey !== badgeKey) {
          drawPlotNumberBadge(badge.canvas, badge.id, hex, !isVisible);
          badge.tex.needsUpdate = true;
          badge.mat.opacity = isVisible ? 1 : 0.25;
          badge.lastKey = badgeKey;
        }
      }
    });

    if (plotPadIM.instanceColor) plotPadIM.instanceColor.needsUpdate = true;
    if (statusBadgeIM.instanceColor) statusBadgeIM.instanceColor.needsUpdate = true;
    if (requestRender) requestRender();
  }, [plotData, statusFilter, isDark]);

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

  /* ── Toggle Fullscreen on Whole 3D Workspace (Bar + Canvas) ── */
  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current || containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
    if (selectBoxRef.current) selectBoxRef.current.visible = false;
    if (requestRenderRef.current) requestRenderRef.current();
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchTerm.trim().replace(/^#/, '');
      if (!q) return;
      const found = MASTER_PLOTS.find((p) => p.id === q);
      if (found) {
        setSelectedEntity(found);
        if (selectBoxRef.current) {
          selectBoxRef.current.position.set(found.x, 2.0, found.z);
          selectBoxRef.current.scale.set(found.w + 0.35, 3.85, found.d + 0.35);
          selectBoxRef.current.visible = true;
        }
        focusOnEntity(found);
        setSearchTerm('');
      }
    },
    [searchTerm, focusOnEntity]
  );

  // Canonical shed modal props (shared 1:1 with 2D site map)
  const shedModalProps = useMemo(
    () =>
      selectedEntity?.kind === 'plot'
        ? buildPark1ModalProps({ shedId: selectedEntity.id, plotData, isDark })
        : { isOpen: false },
    [selectedEntity, plotData, isDark]
  );

  const selectedLandmark =
    selectedEntity && selectedEntity.kind !== 'plot' ? selectedEntity : null;

  const hoverSummary = useMemo(() => {
    if (!hoveredEntity || selectedEntity) return null;
    if (hoveredEntity.kind === 'plot') {
      return {
        kind: 'plot',
        ...getPark1HoverSummary({ shedId: hoveredEntity.id, plotData, isDark: true }),
      };
    }
    return {
      kind: hoveredEntity.kind,
      title: hoveredEntity.title,
      subtitle: hoveredEntity.block,
      statusColor: '#CC2936',
    };
  }, [hoveredEntity, selectedEntity, plotData]);

  const landmarkWhatsappMessage = selectedLandmark
    ? encodeURIComponent(
        `Hello, I would like to inquire about ${selectedLandmark.title} at Metro Industrial Park (MIP 1). Please share visit details.`
      )
    : '';

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full flex flex-col select-none ${
        isFullscreen
          ? `h-screen ${isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]'}`
          : 'h-[62svh] min-h-[420px] sm:h-[68svh] sm:min-h-[580px]'
      }`}
    >
      {/* ── Single-Line 3D Utility Bar (Matching 2D sequence: Search on Left, Edit/Sync/Reset/Expand on Right) ── */}
      <div
        className={`px-2.5 sm:px-3.5 py-2 border-b transition-colors z-10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isDark ? 'border-white/[0.12] bg-[#121215]/95 backdrop-blur-md' : 'border-gray-200 bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={11}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="numeric"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Go #..."
              aria-label="Jump to shed or plot number"
              className={`h-7 w-20 sm:w-28 pl-7 pr-2 border font-mono text-[11px] focus:outline-none focus:border-brand-red ${
                isDark
                  ? 'border-white/[0.12] bg-[#0B0B0D] text-white'
                  : 'border-gray-200 bg-[#F8F9FA] text-gray-900'
              }`}
            />
          </form>
          <span className={`hidden sm:inline font-mono text-[10.5px] uppercase tracking-wider truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            3D · 63 Sheds
          </span>
        </div>

        {/* Right: Actions (Edit, Sync, Reset View, Fullscreen) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={PARK1_ADMIN_SHEET_URL}
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
            onClick={() => loadData(false, true)}
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
            <span>{isFullscreen ? 'Exit' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* ── Single-Row Filterable Live Availability Data Strip (Exact Order as 2D) ── */}
      <div
        className={`border-b grid grid-cols-5 divide-x text-center ${
          isDark ? 'border-white/[0.12] divide-white/[0.12] bg-[#0B0B0D]' : 'border-gray-200 divide-gray-200 bg-[#F8F9FA]'
        }`}
      >
        {statItems.map((item) => {
          const isSelected = statusFilter === item.filterKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.filterKey)}
              className={`py-1.5 px-1 transition-colors flex flex-col items-center justify-center min-w-0 cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-white/[0.08]'
                    : 'bg-white shadow-inner'
                  : isDark
                    ? 'hover:bg-white/[0.03]'
                    : 'hover:bg-white/70'
              }`}
              style={isSelected ? { boxShadow: `inset 0 -2px 0 0 ${item.accentHex}` } : undefined}
            >
              <span className={`text-xs sm:text-sm font-bold tabular-nums leading-none ${item.numClass}`}>
                {item.value}
              </span>
              <span className={`font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-wider mt-0.5 truncate max-w-full ${item.lblClass}`}>
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

        {/* Floating Minimal Hover Tooltip (Exact Data Sequence as 2D) */}
        {hoverSummary && (
          <div className="absolute top-3 left-3 pointer-events-none z-20 p-2.5 border border-white/15 bg-[#121215]/95 backdrop-blur-md text-white shadow-xl min-w-[154px]">
            {hoverSummary.kind === 'plot' ? (
              <>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono font-bold text-xs">{hoverSummary.title}</span>
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase"
                    style={{ background: hoverSummary.statusColor }}
                  >
                    {hoverSummary.statusLabel}
                  </span>
                </div>
                {hoverSummary.sqYdText ? (
                  <p className="text-xs font-bold text-brand-red tabular-nums">
                    {hoverSummary.sqYdText} SQ.YD
                    <span className="font-normal text-gray-400 ml-1 text-[10px]">({hoverSummary.sqFtText} ft²)</span>
                  </p>
                ) : (
                  <p className="text-xs font-bold text-brand-red">{hoverSummary.rawArea}</p>
                )}
                {hoverSummary.phaseLabel && (
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">{hoverSummary.phaseLabel}</p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hoverSummary.statusColor }} />
                <span>{hoverSummary.title}</span>
                <span className="text-gray-400 font-normal">{hoverSummary.subtitle}</span>
              </div>
            )}
          </div>
        )}

        {/* Shared Shed Modal (1:1 Same Sequence & Data as 2D) */}
        <UnitDetailModal
          {...shedModalProps}
          isDark={isDark}
          portalContainer={isFullscreen ? wrapperRef.current : undefined}
          onClose={clearSelection}
        />

        {/* Compact Landmark Drawer (Only for Site Office & Main Gate 3D Landmarks) */}
        {selectedLandmark && (() => {
          const cardBorder = isDark ? 'border-white/15' : 'border-gray-200';
          const subBg = isDark ? 'bg-[#0B0B0D]/80' : 'bg-[#F8F9FA]';

          return (
            <aside
              className={`absolute bottom-2.5 right-2.5 sm:top-3 sm:bottom-auto z-30 w-[calc(100%-1.25rem)] sm:w-[340px] p-3.5 sm:p-4 border shadow-2xl backdrop-blur-xl transition-all ${
                isDark
                  ? 'bg-[#121215]/95 border-white/15 text-white shadow-black/80'
                  : 'bg-white/95 border-gray-200 text-gray-900 shadow-slate-300/80'
              }`}
            >
              <div className={`flex items-start justify-between gap-2 pb-2.5 border-b ${cardBorder}`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider bg-emerald-600 text-white">
                      {selectedLandmark.status}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-gray-400 truncate">
                      {selectedLandmark.block}
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight truncate">
                    {selectedLandmark.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="p-1 text-gray-400 hover:text-brand-red transition"
                  aria-label="Close landmark inspector"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 my-2.5 font-mono text-[10.5px]">
                <div className={`p-2 border ${cardBorder} ${subBg}`}>
                  <span className="text-[9px] uppercase text-gray-400 block">Dimensions</span>
                  <span className="font-bold block mt-0.5 truncate">{selectedLandmark.dimText}</span>
                </div>
                <div className={`p-2 border ${cardBorder} ${subBg}`}>
                  <span className="text-[9px] uppercase text-gray-400 block">Frontage</span>
                  <span className="font-bold block mt-0.5 truncate">{selectedLandmark.roadLabel}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/919824235642?text=${landmarkWhatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <FaWhatsapp size={13} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:919824235642"
                  className={`py-2 px-2.5 font-mono font-bold text-[11px] uppercase flex items-center justify-center gap-1 border transition-colors whitespace-nowrap ${
                    isDark ? 'border-white/15 text-gray-200 hover:border-brand-red' : 'border-gray-200 text-gray-700 hover:border-brand-red'
                  }`}
                >
                  <Phone size={12} />
                  <span>Call</span>
                </a>

                <button
                  type="button"
                  onClick={() => focusOnEntity(selectedLandmark)}
                  className={`py-2 px-2.5 flex items-center justify-center border transition-colors ${
                    isDark ? 'border-white/15 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Focus Camera"
                >
                  <Compass size={13} />
                </button>
              </div>
            </aside>
          );
        })()}
      </div>
    </div>
  );
}
