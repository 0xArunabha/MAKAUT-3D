import type { FirstPersonController } from '../scene/FirstPersonController';
import { STREET_VIEW_SPAWNS } from '../scene/FirstPersonController';

export class StreetViewHUD {
  private controller: FirstPersonController;
  private container: HTMLElement;
  private joystickContainer: HTMLElement;
  private isTouchDevice = false;

  constructor(controller: FirstPersonController) {
    this.controller = controller;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 1. Street View Control Deck
    this.container = document.createElement('div');
    this.container.id = 'street-view-hud';
    this.container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-xl w-[94vw] sm:w-[540px] hidden transition-all duration-300';
    document.body.appendChild(this.container);

    // 2. Mobile Virtual Joystick
    this.joystickContainer = document.createElement('div');
    this.joystickContainer.id = 'virtual-joystick-container';
    this.joystickContainer.className = 'fixed bottom-24 left-6 z-30 pointer-events-auto w-24 h-24 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 hidden touch-none select-none items-center justify-center';
    document.body.appendChild(this.joystickContainer);

    this.controller.onStateChange = (active) => {
      if (active) {
        this.show();
      } else {
        this.hide();
      }
    };

    this.setupJoystick();
  }

  public show() {
    this.render();
    this.container.classList.remove('hidden');
    if (this.isTouchDevice) {
      this.joystickContainer.classList.remove('hidden');
      this.joystickContainer.classList.add('flex');
    }
  }

  public hide() {
    this.container.classList.add('hidden');
    this.joystickContainer.classList.add('hidden');
    this.joystickContainer.classList.remove('flex');
  }

  private render() {
    this.container.innerHTML = `
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-white/50 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col gap-2.5">
        <!-- Top Status Bar & Exit Button -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Street View
            </span>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ground Level (1.7m)
            </span>
          </div>

          <button id="street-view-exit-btn" class="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer active:scale-95">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span>Exit Street View (ESC)</span>
          </button>
        </div>

        <!-- Teleport Pills (Jump to Landmark) -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span class="text-[10px] uppercase font-bold text-slate-400 shrink-0 ml-1 mr-0.5">Teleport:</span>
          ${Object.entries(STREET_VIEW_SPAWNS).map(([key, loc]) => `
            <button class="street-teleport-btn shrink-0 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition cursor-pointer text-slate-700 dark:text-slate-200" data-spawn="${key}">
              ${loc.name}
            </button>
          `).join('')}
        </div>

        <!-- Control Hints Banner -->
        <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 px-1">
          <div class="flex items-center gap-2">
            <span class="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300">WASD</span>
            <span>Walk</span>
            <span>•</span>
            <span class="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300">Shift</span>
            <span>Sprint</span>
            <span>•</span>
            <span>Drag / Mouse to look</span>
          </div>
          <span class="text-[10px] text-slate-400 hidden sm:inline">60 FPS Smooth Movement</span>
        </div>
      </div>
    `;

    document.getElementById('street-view-exit-btn')?.addEventListener('click', () => {
      this.controller.exit();
    });

    document.querySelectorAll('.street-teleport-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const key = target.dataset.spawn;
        if (key) {
          this.controller.teleportTo(key);
        }
      });
    });
  }

  private setupJoystick() {
    this.joystickContainer.innerHTML = `
      <div id="joystick-knob" class="w-10 h-10 rounded-full bg-blue-500/80 shadow-md border-2 border-white/60 pointer-events-none transition-transform duration-75"></div>
    `;

    const knob = document.getElementById('joystick-knob')!;
    let isTracking = false;
    let originX = 0;
    let originY = 0;
    const maxRadius = 36;

    this.joystickContainer.addEventListener('touchstart', (e) => {
      isTracking = true;
      const rect = this.joystickContainer.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isTracking || !this.controller.isActive) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - originX;
      const deltaY = touch.clientY - originY;
      const dist = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      const clampedDist = Math.min(maxRadius, dist);
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

      // Normalize [-1..1]
      this.controller.virtualJoystickMove = {
        x: knobX / maxRadius,
        y: knobY / maxRadius
      };
    }, { passive: false });

    const endJoystick = () => {
      isTracking = false;
      knob.style.transform = 'translate(0px, 0px)';
      this.controller.virtualJoystickMove = { x: 0, y: 0 };
    };

    window.addEventListener('touchend', endJoystick);
    window.addEventListener('touchcancel', endJoystick);
  }
}
