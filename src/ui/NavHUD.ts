import { CAMPUS_WAYPOINTS, type NavWaypoint } from '../data/navGraph';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { findRoute, type RouteResult } from '../utils/pathfinding';
import type { Maneuver } from '../utils/directions';

/** Arrow shown in the step badge for each kind of turn (depart/arrive have their own icons). */
const MANEUVER_ICONS: Partial<Record<Maneuver, string>> = {
  left: '↰',
  right: '↱',
  'slight-left': '↖',
  'slight-right': '↗',
  'sharp-left': '↩',
  'sharp-right': '↪',
};

export class NavHUD {
  private container: HTMLElement;
  private onRouteCalculated: (result: RouteResult | null) => void;
  private currentResult: RouteResult | null = null;

  private startSelect!: HTMLSelectElement;
  private endSelect!: HTMLSelectElement;

  public onStartWalkthrough?: (result: RouteResult) => void;
  public onStepClick?: (coord: [number, number, number]) => void;

  constructor(onRouteCalculated: (result: RouteResult | null) => void) {
    this.container = document.getElementById('navigation-hud-container')!;
    this.onRouteCalculated = onRouteCalculated;

    this.render();
    this.setupEvents();
  }

  private render() {
    // Collect all destination waypoints associated with buildings or landmarks
    const waypointsList = Object.values(CAMPUS_WAYPOINTS).filter(wp => wp.buildingId || wp.id === 'wp-gate' || wp.id === 'wp-central-plaza');

    this.container.innerHTML = `
      <div class="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800/90 text-slate-800 dark:text-slate-100">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <span class="font-bold text-sm text-slate-900 dark:text-white">Campus Wayfinding</span>
          </div>
          <button id="nav-close-btn" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Inputs Container -->
        <div class="space-y-2.5 relative">
          <!-- Start Point -->
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950 shrink-0 ml-1"></div>
            <div class="flex-1">
              <label class="block text-[10px] uppercase font-bold text-slate-400">Starting Point</label>
              <select id="nav-start-select" class="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                ${waypointsList.map(wp => `<option value="${wp.id}">${this.getWaypointDisplayName(wp)}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Swap Button -->
          <div class="flex justify-end pr-3 -my-2 relative z-10">
            <button id="nav-swap-btn" class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center transition shadow-sm cursor-pointer" title="Swap locations">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </button>
          </div>

          <!-- Destination Point -->
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950 shrink-0 ml-1"></div>
            <div class="flex-1">
              <label class="block text-[10px] uppercase font-bold text-slate-400">Destination</label>
              <select id="nav-end-select" class="w-full mt-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                ${waypointsList.map(wp => `<option value="${wp.id}">${this.getWaypointDisplayName(wp)}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Route Summary & Metrics (Injected when calculated) -->
        <div id="nav-summary-box" class="mt-3.5 hidden">
          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-center justify-around text-center">
            <div>
              <span class="block text-lg font-black text-blue-700 dark:text-blue-300" id="route-dist-text">--</span>
              <span class="text-[10px] text-slate-400 uppercase font-bold">Distance</span>
            </div>
            <div class="w-px h-8 bg-blue-200 dark:bg-blue-800"></div>
            <div>
              <span class="block text-lg font-black text-blue-700 dark:text-blue-300" id="route-time-text">--</span>
              <span class="text-[10px] text-slate-400 uppercase font-bold">Walk Time</span>
            </div>
          </div>

          <!-- Step-by-step collapse -->
          <div class="mt-3">
            <button id="nav-steps-toggle" class="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 py-1">
              <span>Turn-by-turn Directions</span>
              <svg id="nav-steps-arrow" class="w-3.5 h-3.5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div id="nav-steps-list" class="mt-2 space-y-1.5 max-h-36 overflow-y-auto hidden pr-1 text-xs">
              <!-- Steps injected here -->
            </div>
          </div>

          <!-- Start Walkthrough Simulation Button -->
          <button id="nav-simulate-walk-btn" class="w-full mt-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Simulate 3D Walkthrough</span>
          </button>

          <!-- Clear Route Button -->
          <button id="nav-clear-btn" class="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer">
            Clear Route
          </button>
        </div>
      </div>
    `;

    this.startSelect = document.getElementById('nav-start-select') as HTMLSelectElement;
    this.endSelect = document.getElementById('nav-end-select') as HTMLSelectElement;

    // Set sensible defaults: Gate -> Academic & Library Building
    this.startSelect.value = 'wp-gate';
    this.endSelect.value = 'wp-acad-crescent';
  }

  private getWaypointDisplayName(wp: NavWaypoint): string {
    if (wp.buildingId) {
      const bldg = CAMPUS_BUILDINGS.find(b => b.id === wp.buildingId);
      if (bldg) return `${bldg.shortName} (${wp.name})`;
    }
    return wp.name;
  }

  private setupEvents() {
    // Close button
    document.getElementById('nav-close-btn')?.addEventListener('click', () => this.hide());

    // Toggle button from main header
    document.getElementById('route-toggle-btn')?.addEventListener('click', () => this.toggle());

    // Selection changes
    this.startSelect.addEventListener('change', () => this.calculate());
    this.endSelect.addEventListener('change', () => this.calculate());

    // Swap button
    document.getElementById('nav-swap-btn')?.addEventListener('click', () => {
      const temp = this.startSelect.value;
      this.startSelect.value = this.endSelect.value;
      this.endSelect.value = temp;
      this.calculate();
    });

    // Clear route
    document.getElementById('nav-clear-btn')?.addEventListener('click', () => {
      this.clear();
    });

    // Simulate walk button
    document.getElementById('nav-simulate-walk-btn')?.addEventListener('click', () => {
      if (this.currentResult && this.onStartWalkthrough) {
        this.onStartWalkthrough(this.currentResult);
      }
    });

    // Steps toggle
    const stepsToggle = document.getElementById('nav-steps-toggle');
    const stepsList = document.getElementById('nav-steps-list');
    const stepsArrow = document.getElementById('nav-steps-arrow');

    stepsToggle?.addEventListener('click', () => {
      stepsList?.classList.toggle('hidden');
      stepsArrow?.classList.toggle('rotate-180');
    });
  }

  public setRoute(startWpId: string, endWpId: string) {
    if (this.startSelect && this.endSelect) {
      this.startSelect.value = startWpId;
      this.endSelect.value = endWpId;
    }
    this.show();
    this.calculate();
  }

  public setDestination(endWpId: string) {
    if (this.endSelect) {
      this.endSelect.value = endWpId;
    }
    this.show();
    this.calculate();
  }

  public calculate() {
    const startId = this.startSelect.value;
    const endId = this.endSelect.value;

    const result = findRoute(startId, endId);
    this.currentResult = result;

    const summaryBox = document.getElementById('nav-summary-box');
    const distText = document.getElementById('route-dist-text');
    const timeText = document.getElementById('route-time-text');
    const stepsList = document.getElementById('nav-steps-list');

    if (result && summaryBox && distText && timeText && stepsList) {
      summaryBox.classList.remove('hidden');
      distText.textContent = `${result.totalDistanceMeters} m`;
      timeText.textContent = `${result.estimatedMinutes} min`;

      stepsList.innerHTML = result.instructions.map((inst, idx) => {
        const isStart = inst.maneuver === 'depart';
        const isEnd = inst.maneuver === 'arrive';
        const iconBg = isStart ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : (isEnd ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300');

        return `
          <div class="nav-step-item flex items-start gap-2.5 py-1.5 px-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 cursor-pointer transition border-b border-slate-100 dark:border-slate-800/60 last:border-0 group" data-step-index="${idx}">
            <span class="w-5 h-5 rounded-full ${iconBg} font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              ${isStart ? '▶' : (isEnd ? '🏁' : (MANEUVER_ICONS[inst.maneuver] ?? idx + 1))}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-slate-800 dark:text-slate-200 text-xs leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${inst.text}</p>
              ${inst.distanceMeters > 0 ? `<span class="text-[10px] text-slate-400 font-semibold inline-block mt-0.5">${inst.distanceMeters} m</span>` : ''}
            </div>
            <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        `;
      }).join('');

      // Attach click events on steps to zoom in on the place where that step happens
      stepsList.querySelectorAll('.nav-step-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          const target = (e.currentTarget as HTMLElement);
          const idx = parseInt(target.dataset.stepIndex || '0', 10);
          const step = result.instructions[idx];
          if (step && this.onStepClick) {
            this.onStepClick(step.position);
          }
        });
      });
    }

    this.onRouteCalculated(result);
  }

  public clear() {
    this.currentResult = null;
    const summaryBox = document.getElementById('nav-summary-box');
    summaryBox?.classList.add('hidden');
    this.onRouteCalculated(null);
  }

  public show() {
    this.container.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
    this.container.classList.add('opacity-100', 'translate-y-0');
  }

  public hide() {
    this.container.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
    this.container.classList.remove('opacity-100', 'translate-y-0');
  }

  public toggle() {
    if (this.container.classList.contains('opacity-0')) {
      this.show();
      if (!this.currentResult) {
        this.calculate();
      }
    } else {
      this.hide();
    }
  }
}
