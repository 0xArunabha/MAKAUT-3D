import type { CameraController } from '../scene/CameraController';

export interface TourStop {
  id: string;
  name: string;
  bengaliName?: string;
  category: string;
  position: [number, number, number];
  cameraOffset: [number, number, number];
  description: string;
  highlights: string[];
}

export const MAKAUT_TOUR_STOPS: TourStop[] = [
  {
    id: 'bldg-gate',
    name: 'MAKAUT Main Gate (WBUT)',
    bengaliName: 'ম্যাকাউট প্রধান প্রবেশদ্বার (WBUT)',
    category: 'Entrance Landmark',
    position: [156, 0, 41],
    cameraOffset: [-32, 18, 26],
    description: 'The iconic ceremonial entrance to the university on NH-12 Haringhata. Features sweeping blue curved steel box girders, open pergola cross-beams, guard cabins, and the historic "W" monument celebrating the legacy of WBUT.',
    highlights: ['Dual Curved Girders', 'WBUT Monument', 'Sintex Water Tower', 'NH-12 Avenue']
  },
  {
    id: 'bldg-fountain',
    name: 'Central Fountain & Recreation Plaza',
    bengaliName: 'সেন্ট্রাল ফোয়ারা ও চত্বর',
    category: 'Campus Center',
    position: [76, 0, 28.5],
    cameraOffset: [0, 20, 32],
    description: 'The social heartbeat of the university campus. Enclosed in a 48m square garden plaza with landscaped yucca beds, vintage lamp posts, shaded student benches, and an aggregate terrazzo fountain basin with an active central spray.',
    highlights: ['Terrazzo Basin', 'Vintage Lanterns', 'Yucca Beds', 'Student Benches']
  },
  {
    id: 'bldg-library',
    name: 'Central Library & 90.0 MHz FM Radio',
    bengaliName: 'কেন্দ্রীয় গ্রন্থাগার ও ৯০.০ এফএম রেডিও',
    category: 'Academic Core',
    position: [-12, 0, 8],
    cameraOffset: [26, 32, 26],
    description: 'The central architectural anchor between the twin crescents. Houses thousands of academic titles, digital e-learning repositories, and MAKAUT\'s licensed community radio station (FM 90.0) topped with an illuminated transmission mast.',
    highlights: ['FM 90.0 Mast Beacon', '5-Story Glazed Core', 'Digital E-Library', 'Penthouse Core']
  },
  {
    id: 'bldg-admin-north',
    name: 'Administrative Building (North Wing)',
    bengaliName: 'প্রশাসনিক ভবন (উত্তর উইং)',
    category: 'University Administration',
    position: [-6, 0, -32],
    cameraOffset: [28, 28, -22],
    description: 'The sweeping North Crescent wing painted in MAKAUT Signature Sky Blue with royal blue trim and a 4-story glazed atrium. Accommodates the Office of the Hon\'ble Vice Chancellor, Registrar, Syndicate Council, and Finance.',
    highlights: ['Vice Chancellor Suite', 'Registrar Office', '4-Story Atrium', 'North Crescent']
  },
  {
    id: 'bldg-acad-south',
    name: 'Academic Building (South Wing)',
    bengaliName: 'একাডেমিক ভবন (দক্ষিণ উইং)',
    category: 'Instruction & Labs',
    position: [-14.8, 0, 52],
    cameraOffset: [28, 32, 28],
    description: 'The mirror South Crescent wing dedicated to Engineering, Computing, and Technology faculties. Features tiered lecture theaters, modern computer laboratories, seminar halls, and faculty rooms.',
    highlights: ['Engineering Labs', 'Smart Classrooms', 'Auditorium Complex', 'South Crescent']
  },
  {
    id: 'bldg-karigari',
    name: 'Cafe Karigari & Food Court',
    bengaliName: 'ক্যাফে কারিগরি ও ফুড কোর্ট',
    category: 'Dining & Student Life',
    position: [112, 0, 32],
    cameraOffset: [-22, 16, 20],
    description: 'Vibrant student dining hub and social space offering hot meals, quick bites, tea, coffee, and packaged refreshments, accompanied nearby by Hydrogen Canteen and the crescent Foodlicious open food stall.',
    highlights: ['Open Canteen', 'Outdoor Seating', 'Hydrogen Canteen', 'Student Hangout']
  },
  {
    id: 'bldg-biotech',
    name: 'Department of Biotechnology Complex',
    bengaliName: 'বায়োটেকনোলজি বিভাগ ভবন',
    category: 'Advanced Research',
    position: [-23, 0, 130],
    cameraOffset: [32, 34, 32],
    description: 'State-of-the-art 5-story linear research complex featuring 14 white structural columns, prominent "MAKAUT, W.B." entrance portico, advanced bio-processing labs, and a large-scale rooftop solar power array.',
    highlights: ['Rooftop Solar Farm', '14 Structural Columns', 'Bio-Informatics Labs', 'Circular Drop-off']
  },
  {
    id: 'bldg-industrial',
    name: 'Circular Academic Dome (IEM & Exam)',
    bengaliName: 'বৃত্তাকার পরীক্ষা ও আইইএম ভবন',
    category: 'Specialized Academics',
    position: [70, 0, 122],
    cameraOffset: [-26, 26, -24],
    description: 'An architectural centerpiece of the southern campus sector with a 2-story cylindrical drum design, 16 royal blue pilasters, glazed entrance tower, and circular lecture theaters housing the IEM department and Examination Control.',
    highlights: ['Cylindrical Architecture', '16 Radial Pilasters', 'Exam Control Hub', 'Curved Hallways']
  },
  {
    id: 'bldg-sports',
    name: 'MAKAUT Sports Ground & Running Track',
    bengaliName: 'ম্যাকাউট খেলার মাঠ ও ট্র্যাক',
    category: 'Athletics & Recreation',
    position: [-65, 0, -40],
    cameraOffset: [0, 36, 48],
    description: 'Expansive campus athletic stadium featuring an authentic red clay running track, full-sized football pitch, and central cricket crease hosting inter-college sports tournaments, annual athletic meets, and fitness activities.',
    highlights: ['Running Track', 'Football Pitch', 'Cricket Crease', 'Floodlit Arena']
  },
  {
    id: 'bldg-hostel-boys',
    name: 'Campus Residential Zone & Hostels',
    bengaliName: 'ছাত্রাবাস ও আবাসিক এলাকা',
    category: 'Student Residences',
    position: [-222, 0, -183],
    cameraOffset: [36, 32, 36],
    description: 'The serene northwest residential sector accommodating MAKAUT Boys\' and Girls\' Hostels, student messes, dining halls, faculty staff quarters, and the university power substation.',
    highlights: ['Multi-Block Hostels', 'Staff Quarters', 'Dining Mess', 'Substation']
  }
];

export class TourController {
  private cameraController: CameraController;
  private container: HTMLElement;
  private currentStopIndex = 0;
  public isActive = false;
  public isAutoPlaying = false;
  private autoPlayTimer: number | null = null;
  private autoPlaySecondsRemaining = 8;
  private countdownInterval: number | null = null;

  public onTourChange?: (stop: TourStop, index: number, total: number) => void;
  public onTourEnd?: () => void;

  constructor(cameraController: CameraController) {
    this.cameraController = cameraController;
    this.container = document.createElement('div');
    this.container.id = 'tour-hud-overlay';
    this.container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-lg w-[92vw] sm:w-[480px] hidden transition-all duration-300';
    document.body.appendChild(this.container);
  }

  public startTour(startIndex = 0) {
    this.isActive = true;
    this.currentStopIndex = startIndex;
    this.isAutoPlaying = true;
    this.container.classList.remove('hidden');
    this.goToStop(this.currentStopIndex);
  }

  public stopTour() {
    this.isActive = false;
    this.isAutoPlaying = false;
    this.clearTimers();
    this.container.classList.add('hidden');
    if (this.onTourEnd) {
      this.onTourEnd();
    }
  }

  public nextStop() {
    if (!this.isActive) return;
    this.currentStopIndex = (this.currentStopIndex + 1) % MAKAUT_TOUR_STOPS.length;
    this.goToStop(this.currentStopIndex);
  }

  public prevStop() {
    if (!this.isActive) return;
    this.currentStopIndex = (this.currentStopIndex - 1 + MAKAUT_TOUR_STOPS.length) % MAKAUT_TOUR_STOPS.length;
    this.goToStop(this.currentStopIndex);
  }

  public toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlayTimer();
    } else {
      this.clearTimers();
    }
    this.render();
  }

  public goToStop(index: number) {
    this.currentStopIndex = Math.max(0, Math.min(index, MAKAUT_TOUR_STOPS.length - 1));
    const stop = MAKAUT_TOUR_STOPS[this.currentStopIndex];

    this.cameraController.flyTo(stop.position, stop.cameraOffset, 1200);

    if (this.isAutoPlaying) {
      this.startAutoPlayTimer();
    } else {
      this.clearTimers();
    }

    this.render();

    if (this.onTourChange) {
      this.onTourChange(stop, this.currentStopIndex, MAKAUT_TOUR_STOPS.length);
    }
  }

  private startAutoPlayTimer() {
    this.clearTimers();
    this.autoPlaySecondsRemaining = 8;

    this.countdownInterval = window.setInterval(() => {
      this.autoPlaySecondsRemaining--;
      const timerEl = document.getElementById('tour-timer-text');
      if (timerEl) {
        timerEl.textContent = `${this.autoPlaySecondsRemaining}s`;
      }
      if (this.autoPlaySecondsRemaining <= 0) {
        this.nextStop();
      }
    }, 1000);
  }

  private clearTimers() {
    if (this.autoPlayTimer) {
      window.clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    if (this.countdownInterval) {
      window.clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private render() {
    const stop = MAKAUT_TOUR_STOPS[this.currentStopIndex];
    const total = MAKAUT_TOUR_STOPS.length;
    const progressPercent = Math.round(((this.currentStopIndex + 1) / total) * 100);

    this.container.innerHTML = `
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/50 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col gap-3">
        <!-- Header with Stop Badge & Close -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              Stop ${this.currentStopIndex + 1} of ${total}
            </span>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ${stop.category}
            </span>
          </div>

          <div class="flex items-center gap-2">
            ${this.isAutoPlaying ? `
              <span class="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                Next in <span id="tour-timer-text">${this.autoPlaySecondsRemaining}s</span>
              </span>
            ` : ''}
            <button id="tour-close-btn" class="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer" title="Exit Tour">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-blue-600 h-full transition-all duration-500" style="width: ${progressPercent}%"></div>
        </div>

        <!-- Title & Bengali Name -->
        <div>
          <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            ${stop.name}
          </h2>
          ${stop.bengaliName ? `
            <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              ${stop.bengaliName}
            </p>
          ` : ''}
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ${stop.description}
        </p>

        <!-- Highlights Chips -->
        <div class="flex flex-wrap gap-1.5">
          ${stop.highlights.map(h => `
            <span class="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
              ✓ ${h}
            </span>
          `).join('')}
        </div>

        <!-- Navigation Controls Footer -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-1">
          <button id="tour-prev-btn" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span>Previous</span>
          </button>

          <button id="tour-play-toggle-btn" class="px-3.5 py-1.5 rounded-xl ${this.isAutoPlaying ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'} font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
            ${this.isAutoPlaying ? `
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 9v6m4-6v6"></path></svg>
              <span>Pause Auto</span>
            ` : `
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
              <span>Play Auto</span>
            `}
          </button>

          <button id="tour-next-btn" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer">
            <span>Next</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    `;

    document.getElementById('tour-close-btn')?.addEventListener('click', () => this.stopTour());
    document.getElementById('tour-prev-btn')?.addEventListener('click', () => this.prevStop());
    document.getElementById('tour-next-btn')?.addEventListener('click', () => this.nextStop());
    document.getElementById('tour-play-toggle-btn')?.addEventListener('click', () => this.toggleAutoPlay());
  }
}
