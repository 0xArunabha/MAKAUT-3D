import { CAMPUS_BUILDINGS, type BuildingData } from '../data/campusData';

export class SearchPalette {
  private backdrop: HTMLElement;
  private input: HTMLInputElement;
  private resultsList: HTMLElement;
  private closeBtn: HTMLElement;
  private categoryButtons: NodeListOf<HTMLButtonElement>;

  private currentCategory = 'all';
  private onSelectBuilding: (building: BuildingData) => void;

  constructor(onSelectBuilding: (building: BuildingData) => void) {
    this.onSelectBuilding = onSelectBuilding;

    this.backdrop = document.getElementById('search-modal-backdrop')!;
    this.input = document.getElementById('search-input') as HTMLInputElement;
    this.resultsList = document.getElementById('search-results-list')!;
    this.closeBtn = document.getElementById('search-close-btn')!;
    this.categoryButtons = document.querySelectorAll('.search-category-btn');

    this.setupEvents();
    this.renderResults('');
  }

  private setupEvents() {
    // Search trigger button from header
    const triggerBtn = document.getElementById('search-trigger-btn');
    triggerBtn?.addEventListener('click', () => this.open());

    // Close button
    this.closeBtn.addEventListener('click', () => this.close());

    // Backdrop click
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // Keyboard shortcuts (Cmd+K / Ctrl+K, ESC, ArrowUp, ArrowDown, Enter)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      } else if (this.isOpen()) {
        const items = this.resultsList.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % items.length;
          this.updateSelectedItem(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
          this.updateSelectedItem(items);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const activeItem = items[this.selectedIndex] as HTMLElement;
          activeItem?.click();
        }
      }
    });

    // Real-time input typing
    this.input.addEventListener('input', () => {
      this.selectedIndex = 0;
      this.renderResults(this.input.value.trim());
    });

    // Category button filters
    this.categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.categoryButtons.forEach(b => {
          b.classList.remove('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900/50', 'dark:text-blue-300', 'font-semibold');
          b.classList.add('text-slate-600', 'dark:text-slate-400', 'font-medium');
        });
        btn.classList.add('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900/50', 'dark:text-blue-300', 'font-semibold');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'font-medium');

        this.currentCategory = btn.dataset.category || 'all';
        this.selectedIndex = 0;
        this.renderResults(this.input.value.trim());
      });
    });
  }

  private selectedIndex = 0;

  private updateSelectedItem(items: NodeListOf<Element>) {
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('bg-blue-50', 'dark:bg-blue-950/40', 'ring-1', 'ring-blue-500/30');
        (item as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('bg-blue-50', 'dark:bg-blue-950/40', 'ring-1', 'ring-blue-500/30');
      }
    });
  }

  public isOpen(): boolean {
    return !this.backdrop.classList.contains('pointer-events-none');
  }

  public open() {
    this.backdrop.classList.remove('opacity-0', 'pointer-events-none');
    this.backdrop.classList.add('opacity-100');
    const content = document.getElementById('search-modal-content');
    content?.classList.remove('scale-95');
    content?.classList.add('scale-100');

    this.input.value = '';
    this.selectedIndex = 0;
    this.renderResults('');
    setTimeout(() => this.input.focus(), 50);
  }

  public close() {
    this.backdrop.classList.add('opacity-0', 'pointer-events-none');
    this.backdrop.classList.remove('opacity-100');
    const content = document.getElementById('search-modal-content');
    content?.classList.add('scale-95');
    content?.classList.remove('scale-100');
  }

  public toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  private filterBuildings(query: string): BuildingData[] {
    const q = query.toLowerCase();

    return CAMPUS_BUILDINGS.filter((bldg) => {
      // 1. Category filter
      if (this.currentCategory !== 'all' && bldg.category !== this.currentCategory) {
        return false;
      }

      // 2. Query match
      if (!q) return true;

      const nameMatch = bldg.name.toLowerCase().includes(q) || bldg.shortName.toLowerCase().includes(q);
      const bengaliMatch = bldg.bengaliName ? bldg.bengaliName.toLowerCase().includes(q) : false;
      const deptMatch = bldg.departments.some(d => d.toLowerCase().includes(q));
      const facilityMatch = bldg.facilities.some(f => f.toLowerCase().includes(q));
      const tagMatch = bldg.tags.some(t => t.toLowerCase().includes(q));

      // Quick acronym matching e.g. "cse", "it", "coe", "vc"
      const acronymMatch = bldg.departments.some(d => {
        const words = d.split(/\s+/);
        const letters = words.map(w => w[0]?.toLowerCase()).join('');
        return letters.includes(q);
      });

      return nameMatch || bengaliMatch || deptMatch || facilityMatch || tagMatch || acronymMatch;
    });
  }

  private renderResults(query: string) {
    const results = this.filterBuildings(query);
    this.resultsList.innerHTML = '';

    if (results.length === 0) {
      this.resultsList.innerHTML = `
        <div class="py-12 text-center text-slate-400">
          <svg class="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium text-sm">No campus locations found for "${query}"</p>
          <p class="text-xs mt-1 text-slate-400">Try searching "CSE", "Library", "ATM", or "Canteen"</p>
        </div>
      `;
      return;
    }

    results.forEach((bldg, idx) => {
      const item = document.createElement('div');
      const isSelected = idx === this.selectedIndex;
      item.className = `search-result-item flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition group ${
        isSelected ? 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-500/30' : ''
      }`;
      
      const badgeBg = {
        academic: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
        admin: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        amenity: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        hostel: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
      }[bldg.category];

      // Format highlight tags
      const deptsDisplay = bldg.departments.slice(0, 2).join(' • ');

      item.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style="background-color: ${bldg.accentColor}20; color: ${bldg.accentColor}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                ${bldg.name}
              </span>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badgeBg} shrink-0">
                ${bldg.category}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              ${deptsDisplay || bldg.description}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-xs font-semibold pl-2 shrink-0">
          <span>Fly to</span>
          <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      `;

      item.addEventListener('click', () => {
        this.close();
        this.onSelectBuilding(bldg);
      });

      this.resultsList.appendChild(item);
    });
  }
}
