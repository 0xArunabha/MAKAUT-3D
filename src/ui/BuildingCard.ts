import type { BuildingData } from '../data/campusData';

export class BuildingCard {
  private container: HTMLElement;
  public currentBuilding: BuildingData | null = null;
  private onNavigateHere: (building: BuildingData) => void;

  constructor(onNavigateHere: (building: BuildingData) => void) {
    this.container = document.getElementById('building-card-container')!;
    this.onNavigateHere = onNavigateHere;
  }

  public show(building: BuildingData) {
    this.currentBuilding = building;

    const badgeClasses = {
      academic: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      admin: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      amenity: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      hostel: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
    }[building.category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

    this.container.innerHTML = `
      <div class="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-800/90 text-slate-800 dark:text-slate-100 overflow-hidden max-h-[75vh] flex flex-col">
        <!-- Mobile bottom sheet drag indicator -->
        <div class="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2 sm:hidden shrink-0"></div>

        <!-- Top Bar with Close Button -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center flex-wrap gap-2 mb-1">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${badgeClasses}">
                ${building.category}
              </span>
              ${building.status ? `
                <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  building.status.toLowerCase().includes('closed')
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-300 dark:ring-rose-800'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }">
                  ${building.status}
                </span>
              ` : ''}
              ${building.timings ? `
                <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ${building.timings}
                </span>
              ` : ''}
            </div>
            <h2 class="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              ${building.name}
            </h2>
            ${building.bengaliName ? `
              <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                ${building.bengaliName}
              </p>
            ` : ''}
          </div>
          <button id="card-close-btn" class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-300 mt-2.5 leading-relaxed">
          ${building.description}
        </p>

        <!-- Departments List -->
        ${building.departments.length > 0 ? `
          <div class="mt-3.5">
            <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Departments & Offices</h3>
            <div class="flex flex-wrap gap-1.5">
              ${building.departments.map(dept => `
                <span class="text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                  ${dept}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Facilities List -->
        ${building.facilities.length > 0 ? `
          <div class="mt-3">
            <h3 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Key Facilities</h3>
            <div class="flex flex-wrap gap-1.5">
              ${building.facilities.map(fac => `
                <span class="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                  • ${fac}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Action Buttons: Directions & Share Link -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <button id="card-directions-btn" class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            <span>Directions to here</span>
          </button>

          <button id="card-share-btn" title="Copy shareable link" class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0">
            <svg id="share-icon-link" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span id="share-text">Share</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('card-close-btn')?.addEventListener('click', () => this.hide());
    document.getElementById('card-directions-btn')?.addEventListener('click', () => {
      this.onNavigateHere(building);
    });

    const shareBtn = document.getElementById('card-share-btn');
    const shareText = document.getElementById('share-text');
    shareBtn?.addEventListener('click', () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}#bldg=${building.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        if (shareText) {
          shareText.textContent = 'Copied!';
          setTimeout(() => {
            if (shareText) shareText.textContent = 'Share';
          }, 2000);
        }
      }).catch(() => {
        window.location.hash = `bldg=${building.id}`;
      });
    });

    this.container.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
    this.container.classList.add('opacity-100', 'translate-y-0');
  }

  public hide() {
    this.container.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
    this.container.classList.remove('opacity-100', 'translate-y-0');
    this.currentBuilding = null;
  }
}
