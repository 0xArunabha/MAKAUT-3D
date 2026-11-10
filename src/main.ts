import './style.css';
import { CampusScene } from './scene/CampusScene';
import { CameraController } from './scene/CameraController';
import { WalkthroughController } from './scene/WalkthroughController';
import { FirstPersonController } from './scene/FirstPersonController';
import { SearchPalette } from './ui/SearchPalette';
import { BuildingCard } from './ui/BuildingCard';
import { NavHUD } from './ui/NavHUD';
import { WalkthroughHUD } from './ui/WalkthroughHUD';
import { TourController } from './ui/TourController';
import { StreetViewHUD } from './ui/StreetViewHUD';
import { CAMPUS_BUILDINGS, PRESET_VIEWS, type BuildingData } from './data/campusData';
import { getWaypointForBuilding } from './utils/pathfinding';

function init() {
  const canvasContainer = document.getElementById('canvas-container');
  if (!canvasContainer) return;

  // 1. Initialize 3D Scene
  const scene = new CampusScene(canvasContainer);

  // 2. Initialize Camera Controller (Orbit mode)
  const cameraController = new CameraController(scene.camera, scene.renderer.domElement);

  // 3. Initialize Interactive Ground Street View Mode
  const firstPersonController = new FirstPersonController(scene.camera, scene.renderer.domElement, cameraController);
  new StreetViewHUD(firstPersonController);

  // 4. Initialize Interactive Walkthrough & Guided Tour
  const walkthroughController = new WalkthroughController(scene.scene, scene.camera, cameraController);
  const walkthroughHUD = new WalkthroughHUD(walkthroughController);
  const tourController = new TourController(cameraController);

  // 5. Initialize UI Components
  const buildingCard = new BuildingCard((building: BuildingData) => {
    // "Directions to here" clicked from card
    buildingCard.hide();
    const wp = getWaypointForBuilding(building.id);
    if (wp) {
      navHUD.setDestination(wp.id);
    }
  });

  const navHUD = new NavHUD((result) => {
    if (result) {
      scene.drawNavigationPath(result.pathCoordinates);
      cameraController.fitRoute(result.pathCoordinates);
    } else {
      scene.clearNavigationPath();
      walkthroughController.stop();
      walkthroughHUD.hide();
    }
  });

  navHUD.onStartWalkthrough = (result) => {
    buildingCard.hide();
    tourController.stopTour();
    firstPersonController.exit();
    walkthroughController.start(result);
    walkthroughHUD.show();
  };

  navHUD.onStepClick = (coord) => {
    firstPersonController.exit();
    cameraController.flyTo(coord, [0, 24, 30], 800);
  };

  new SearchPalette((building: BuildingData) => {
    focusOnBuilding(building);
  });

  // 6. Focus on Building Helper
  const focusOnBuilding = (building: BuildingData) => {
    firstPersonController.exit();
    walkthroughController.stop();
    walkthroughHUD.hide();
    tourController.stopTour();

    buildingCard.show(building);
    
    // Smooth cinematic camera fly-to
    cameraController.flyTo(
      building.position,
      [0, Math.max(22, building.size[1] * 2.2), Math.max(30, building.size[2] * 2.5)],
      1300
    );
  };

  // 7. Connect 3D Scene Interactivity
  scene.onBuildingClick = (building) => {
    focusOnBuilding(building);
  };

  scene.onDoubleTapGround = (pos) => {
    firstPersonController.exit();
    walkthroughController.stop();
    walkthroughHUD.hide();
    tourController.stopTour();

    // Zoom in and center on the clicked/tapped location
    cameraController.flyTo(
      [pos.x, 0, pos.z],
      [0, 36, 46],
      800
    );
  };

  // 8. Street View Button Trigger
  const streetViewBtn = document.getElementById('btn-street-view');
  streetViewBtn?.addEventListener('click', () => {
    if (firstPersonController.isActive) {
      firstPersonController.exit();
    } else {
      buildingCard.hide();
      walkthroughController.stop();
      walkthroughHUD.hide();
      tourController.stopTour();
      scene.clearNavigationPath();
      navHUD.clear();
      navHUD.hide();
      firstPersonController.enter('gate');
    }
  });

  // 9. Guided Tour Button
  document.getElementById('btn-start-tour')?.addEventListener('click', () => {
    firstPersonController.exit();
    buildingCard.hide();
    walkthroughController.stop();
    walkthroughHUD.hide();
    scene.clearNavigationPath();
    navHUD.clear();
    navHUD.hide();
    tourController.startTour();
  });

  // 10. Map Preset View Buttons
  const presetButtons = document.querySelectorAll('.view-preset-btn');
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      firstPersonController.exit();
      walkthroughController.stop();
      walkthroughHUD.hide();
      tourController.stopTour();

      const target = e.currentTarget as HTMLElement;
      const viewKey = target.dataset.view as keyof typeof PRESET_VIEWS;
      if (viewKey) {
        cameraController.flyToPreset(viewKey);
      }
    });
  });

  // 11. Day / Night Theme Toggle
  const themeBtn = document.getElementById('btn-theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  let isNight = false;

  themeBtn?.addEventListener('click', () => {
    isNight = !isNight;
    scene.setTheme(isNight ? 'night' : 'day');
    if (isNight) {
      iconSun?.classList.remove('hidden');
      iconMoon?.classList.add('hidden');
      document.documentElement.classList.add('dark');
    } else {
      iconSun?.classList.add('hidden');
      iconMoon?.classList.remove('hidden');
      document.documentElement.classList.remove('dark');
    }
  });

  // 12. Compass Reset North Widget
  document.getElementById('btn-compass')?.addEventListener('click', () => {
    if (firstPersonController.isActive) {
      firstPersonController.yaw = -Math.PI / 2;
    } else {
      cameraController.resetHeadingNorth();
    }
  });
  const compassNeedle = document.getElementById('compass-needle');

  // 13. Building Labels Visibility Toggle
  const labelsBtn = document.getElementById('btn-labels-toggle');
  const iconLabelsOn = document.getElementById('icon-labels-on');
  const iconLabelsOff = document.getElementById('icon-labels-off');

  labelsBtn?.addEventListener('click', () => {
    const visible = scene.toggleLabels();
    if (visible) {
      iconLabelsOn?.classList.remove('hidden');
      iconLabelsOff?.classList.add('hidden');
    } else {
      iconLabelsOn?.classList.add('hidden');
      iconLabelsOff?.classList.remove('hidden');
    }
  });

  // 14. Floating Zoom, Mode & Reset Buttons
  const modeBtn = document.getElementById('btn-mode-toggle');
  const iconPan = document.getElementById('icon-pan-mode');
  const iconRotate = document.getElementById('icon-rotate-mode');
  const helperText = document.getElementById('helper-mode-text');

  const updateModeUI = (mode: 'pan' | 'rotate') => {
    if (mode === 'pan') {
      iconPan?.classList.remove('hidden');
      iconRotate?.classList.add('hidden');
      modeBtn?.classList.remove('bg-indigo-600');
      modeBtn?.classList.add('bg-blue-600');
      modeBtn?.setAttribute('title', 'Current: Pan Mode (Drag to move map). Click to switch to Rotate (R)');
      if (helperText) helperText.textContent = '✋ Drag to move map';
    } else {
      iconPan?.classList.add('hidden');
      iconRotate?.classList.remove('hidden');
      modeBtn?.classList.remove('bg-blue-600');
      modeBtn?.classList.add('bg-indigo-600');
      modeBtn?.setAttribute('title', 'Current: Rotate Mode (Drag to orbit view). Click to switch to Pan (R)');
      if (helperText) helperText.textContent = '🔄 Drag to orbit 3D view';
    }
  };

  // Initialize UI to default 3D rotate/orbit mode
  updateModeUI('rotate');

  modeBtn?.addEventListener('click', () => {
    const newMode = cameraController.toggleInteractionMode();
    updateModeUI(newMode);
  });

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (!firstPersonController.isActive) {
      cameraController.zoomIn(18);
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (!firstPersonController.isActive) {
      cameraController.zoomOut(18);
    }
  });

  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    buildingCard.hide();
    firstPersonController.exit();
    walkthroughController.stop();
    walkthroughHUD.hide();
    tourController.stopTour();
    cameraController.flyToPreset('overview');
  });

  // 15. Keyboard navigation & shortcuts (WASD / Arrows to pan, R to toggle mode, Ctrl/Alt to rotate)
  window.addEventListener('keydown', (e) => {
    const activeTag = (document.activeElement as HTMLElement)?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    // In first person mode, WASD is handled by FirstPersonController directly
    if (firstPersonController.isActive) return;

    const step = e.shiftKey ? 32 : 16;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        cameraController.panBy(0, -step);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        cameraController.panBy(0, step);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        cameraController.panBy(-step, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        cameraController.panBy(step, 0);
        break;
      case 'r':
      case 'R': {
        const mode = cameraController.toggleInteractionMode();
        updateModeUI(mode);
        break;
      }
      case 'Control':
      case 'Alt':
        cameraController.setTemporaryRotate(true);
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (firstPersonController.isActive) return;
    if (e.key === 'Control' || e.key === 'Alt') {
      cameraController.setTemporaryRotate(false);
    }
  });

  // 16. Deep Linking & URL Parameter Support
  const handleDeepLink = () => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);

    if (hash.startsWith('#bldg=') || urlParams.has('bldg')) {
      const bldgId = hash.startsWith('#bldg=') ? hash.replace('#bldg=', '') : urlParams.get('bldg');
      const bldg = CAMPUS_BUILDINGS.find(b => b.id === bldgId);
      if (bldg) {
        setTimeout(() => focusOnBuilding(bldg), 400);
      }
    } else if (hash === '#tour' || urlParams.get('tour') === 'true') {
      setTimeout(() => tourController.startTour(), 500);
    } else if (hash.startsWith('#streetview') || urlParams.has('streetview')) {
      const spawnKey = hash.includes('=') ? hash.split('=')[1] : (urlParams.get('streetview') || 'gate');
      setTimeout(() => firstPersonController.enter(spawnKey), 500);
    }
  };
  handleDeepLink();
  window.addEventListener('hashchange', handleDeepLink);

  // 17. Main Render Loop
  let lastTime = performance.now();
  const animate = (time: number) => {
    requestAnimationFrame(animate);
    const deltaSeconds = Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;

    cameraController.update(time);
    firstPersonController.update(deltaSeconds, time);
    walkthroughController.update(deltaSeconds, time);
    scene.update(time);

    // Sync interactive compass needle with camera orientation
    if (compassNeedle) {
      const headingRad = firstPersonController.isActive
        ? firstPersonController.yaw + Math.PI / 2
        : cameraController.getAzimuthalAngle();
      compassNeedle.style.transform = `rotate(${-headingRad * (180 / Math.PI)}deg)`;
    }
  };
  requestAnimationFrame(animate);
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
