import type { WalkthroughController, WalkthroughState } from '../scene/WalkthroughController';

export class WalkthroughHUD {
  private controller: WalkthroughController;
  private container: HTMLElement;

  constructor(controller: WalkthroughController) {
    this.controller = controller;

    this.container = document.createElement('div');
    this.container.id = 'walkthrough-hud-overlay';
    this.container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-lg w-[92vw] sm:w-[500px] hidden transition-all duration-300';
    document.body.appendChild(this.container);

    this.controller.onProgress = (state) => {
      this.updateState(state);
    };

    this.controller.onComplete = () => {
      const banner = document.getElementById('walkthrough-instruction-text');
      if (banner) {
        banner.textContent = '🎉 You have arrived at your destination!';
      }
      const playIcon = document.getElementById('walk-play-icon');
      const pauseIcon = document.getElementById('walk-pause-icon');
      playIcon?.classList.remove('hidden');
      pauseIcon?.classList.add('hidden');
    };
  }

  public show() {
    this.render();
    this.container.classList.remove('hidden');
  }

  public hide() {
    this.container.classList.add('hidden');
  }

  private render() {
    this.container.innerHTML = `
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/50 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col gap-3">
        <!-- Top Status Bar -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Live Walkthrough
            </span>
            <span id="walkthrough-metrics-text" class="text-xs font-bold text-slate-500 dark:text-slate-400">
              0m / 0m (0%)
            </span>
          </div>

          <button id="walkthrough-exit-btn" class="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span>Exit Walk</span>
          </button>
        </div>

        <!-- Current Step Instruction Banner -->
        <div class="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </div>
          <span id="walkthrough-instruction-text" class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Follow the highlighted campus pathway...
          </span>
        </div>

        <!-- Progress Slider -->
        <div class="flex items-center gap-3">
          <input
            id="walkthrough-progress-slider"
            type="range"
            min="0"
            max="1000"
            value="0"
            class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <!-- Controls: Play/Pause, Speeds -->
        <div class="flex items-center justify-between pt-1">
          <!-- Play / Pause Button -->
          <button id="walkthrough-play-btn" class="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/30 transition cursor-pointer active:scale-95">
            <svg id="walk-play-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            </svg>
            <svg id="walk-pause-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 9v6m4-6v6"></path>
            </svg>
          </button>

          <!-- Speed Pill Options -->
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button class="walk-speed-btn px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs transition cursor-pointer" data-speed="1">1x</button>
            <button class="walk-speed-btn px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer" data-speed="2">2x</button>
            <button class="walk-speed-btn px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer" data-speed="4">4x</button>
          </div>
        </div>
      </div>
    `;

    const exitBtn = document.getElementById('walkthrough-exit-btn');
    const playBtn = document.getElementById('walkthrough-play-btn');
    const slider = document.getElementById('walkthrough-progress-slider') as HTMLInputElement;
    const speedBtns = document.querySelectorAll('.walk-speed-btn');

    exitBtn?.addEventListener('click', () => {
      this.controller.stop();
      this.hide();
    });

    playBtn?.addEventListener('click', () => {
      this.controller.togglePlay();
      const playIcon = document.getElementById('walk-play-icon');
      const pauseIcon = document.getElementById('walk-pause-icon');
      if (this.controller.isPlaying) {
        playIcon?.classList.add('hidden');
        pauseIcon?.classList.remove('hidden');
      } else {
        playIcon?.classList.remove('hidden');
        pauseIcon?.classList.add('hidden');
      }
    });

    slider?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      this.controller.seek(val / 1000);
    });

    speedBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const speed = parseInt(target.dataset.speed || '1', 10) as 1 | 2 | 4;
        this.controller.setSpeed(speed);

        speedBtns.forEach(b => {
          b.className = 'walk-speed-btn px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer';
        });
        target.className = 'walk-speed-btn px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs transition cursor-pointer';
      });
    });
  }

  private updateState(state: WalkthroughState) {
    const metricsEl = document.getElementById('walkthrough-metrics-text');
    const instructionEl = document.getElementById('walkthrough-instruction-text');
    const slider = document.getElementById('walkthrough-progress-slider') as HTMLInputElement;
    const playIcon = document.getElementById('walk-play-icon');
    const pauseIcon = document.getElementById('walk-pause-icon');

    if (metricsEl) {
      const pct = Math.round(state.progress * 100);
      metricsEl.textContent = `${state.distanceCoveredMeters}m / ${state.totalDistanceMeters}m (${pct}%)`;
    }

    if (instructionEl && state.currentInstruction) {
      instructionEl.textContent = state.currentInstruction;
    }

    if (slider) {
      slider.value = String(Math.round(state.progress * 1000));
    }

    if (playIcon && pauseIcon) {
      if (state.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    }
  }
}
