export interface BuildingData {
  id: string;
  name: string;
  bengaliName?: string;
  shortName: string;
  category: 'academic' | 'admin' | 'amenity' | 'hostel';
  position: [number, number, number]; // [x, y, z] in world units
  size: [number, number, number];     // [width, height, depth]
  wallColor: string;
  accentColor: string;
  roofColor: string;
  floors: number;
  description: string;
  departments: string[];
  facilities: string[];
  timings?: string;
  tags: string[];
  status?: string;
}

export const CAMPUS_BUILDINGS: BuildingData[] = [
  // 1. Crescent Complex: Administrative Building (North Crescent)
  {
    id: 'bldg-admin-north',
    name: 'MAKAUT Administrative Building',
    bengaliName: 'ম্যাকাউট প্রশাসনিক ভবন',
    shortName: 'Administrative Building',
    category: 'admin',
    position: [-6, 0, -32],
    size: [48, 16, 18],
    wallColor: '#6ba3d6', // Authentic MAKAUT Sky Blue
    accentColor: '#1d4ed8', // Royal Blue
    roofColor: '#1e3a8a',
    floors: 4,
    description: 'The sweeping North curved crescent wing of the flagship university complex, painted in the signature MAKAUT Sky Blue with dark blue window frames and a 4-story glazed entrance atrium. Houses the Vice Chancellor\'s Secretariat, Registrar, Controller of Examinations (COE), and University Administration.',
    departments: [
      'Hon\'ble Vice Chancellor Secretariat',
      'Registrar Office & Syndicate Council',
      'Controller of Examinations (COE) Cell',
      'Finance, Cash & Accounts Office',
      'University Administration & Personnel'
    ],
    facilities: ['VC Chamber', 'Syndicate Council Room', 'Exam Confidential Section', 'Executive Committee Hall'],
    timings: '10:00 AM - 5:30 PM (Mon - Fri)',
    tags: ['admin', 'vc', 'registrar', 'exam', 'coe', 'crescent', 'office', 'administration']
  },

  // 1b. Central Core: MAKAUT Central Library & 90.0 MHz FM Radio Station
  {
    id: 'bldg-library',
    name: 'MAKAUT Central Library & 90.0 MHz FM Radio Station',
    bengaliName: 'ম্যাকাউট কেন্দ্রীয় গ্রন্থাগার ও ৯০.০ এফএম রেডিও',
    shortName: 'Central Library & FM Station',
    category: 'academic',
    position: [-12, 0, 8],
    size: [33, 19, 26],
    wallColor: '#1d4ed8', // Authentic MAKAUT Royal Blue Flared Exoskeleton
    accentColor: '#60a5fa', // Sky Blue and Faceted Glass
    roofColor: '#1e3a8a',
    floors: 5,
    description: 'The flagship 5-story inverted-taper jewel of MAKAUT Haringhata. Features outward-flaring royal blue structural exoskeleton columns, faceted central dark glass prow atrium, multi-floor air-conditioned reading halls, illuminated LED marquee, central rooftop 8-fan HVAC chiller plant, open steel signage truss, and the MAKAUT 90.0 MHz Community FM Radio broadcast studio with a 22m red/white transmission mast.',
    departments: [
      'MAKAUT Central Library & Information Center',
      'Ground Floor: Main Entrance Lobby, Circulation Desk & Baggage Counter',
      '1st Floor: General Book Stack & Reading Hall 1 (Capacity 150)',
      '2nd Floor: Periodicals Archive, Journals & Reading Hall 2',
      '3rd Floor: Digital E-Library & Research Scholar Cubicles',
      '4th Floor: MAKAUT 90.0 MHz Community FM Radio Station & Sound Booth',
      '5th Floor: Conference Hall & Rare Documents Archive'
    ],
    facilities: [
      'Central Library Reading Halls (AC, Wi-Fi)',
      'Digital E-Library Research Terminals & OPAC',
      'MAKAUT 90.0 MHz FM Broadcast Studio & Control Console',
      '22m FM Radio Lattice Transmission Mast (Blinking Beacon)',
      'Central Rooftop 8-Fan HVAC Chiller Plant',
      'Amber Illuminated LED Signage Marquee',
      'Forecourt Landscaped Lawn & Seating Benches'
    ],
    timings: '9:00 AM - 8:00 PM (Mon - Sat)',
    tags: ['library', 'books', 'fm', 'radio', 'study', 'reading', 'broadcast', 'central', 'atrium', 'research', 'station'],
    status: 'Open'
  },

  // 2. Crescent Complex: Academic Building (South Crescent)
  {
    id: 'bldg-acad-south',
    name: 'Academic Building (MAKAUT)',
    bengaliName: 'শিক্ষা ভবন (ম্যাকাউট)',
    shortName: 'Academic Building',
    category: 'academic',
    position: [-14.8, 0, 52],
    size: [52, 18, 18],
    wallColor: '#6ba3d6', // Authentic MAKAUT Sky Blue
    accentColor: '#1d4ed8', // Royal Blue
    roofColor: '#0284c7',
    floors: 5,
    description: 'The South curved crescent wing painted in signature MAKAUT Sky Blue. The South facade facing the BioTech sector features 5 grand multi-story reflective dark cyan curtain wall bays, structural pylons with vertical white accent slits, ground-floor lecture hall windows, a center university entrance framed by a vibrant colorful mosaic mural, central elevated rooftop penthouse core, and the eastern sloped glazed skylight canopy.',
    departments: [
      'Dept. of Computer Science & Engineering (CSE)',
      'Dept. of Information Technology (IT)',
      'Dept. of Artificial Intelligence & Data Science',
      'Dept. of Electronics & Communication (ECE)'
    ],
    facilities: [
      '5 Multi-Story Reflective Cyan Curtain Wall Bays',
      'Center University Entrance & Colorful Mosaic Artwork Mural',
      'Smart Classrooms L-101 to L-120',
      'Sloped Glazed Skylight Atrium',
      'High-Performance Computing & GPU Lab',
      'Electronics & Microprocessor Labs'
    ],
    timings: '9:00 AM - 6:30 PM (Mon - Sat)',
    tags: ['cse', 'it', 'ai', 'academic', 'engineering', 'cs', 'ece', 'lecture hall', 'study', 'classroom', 'mural', 'curtain', 'glass'],
    status: 'Open'
  },

  // 2b. Foodlicious (Active Eatery & Kiosk)
  {
    id: 'bldg-foodlicious',
    name: 'Foodlicious',
    bengaliName: 'ফুডিলিসাস',
    shortName: 'Foodlicious',
    category: 'amenity',
    position: [-56, 0, -16],
    size: [12, 5, 10],
    wallColor: '#fef3c7',
    accentColor: '#ea580c',
    roofColor: '#d97706',
    floors: 1,
    description: 'Popular active university cafe and food kiosk located in the open plaza west of the Administrative Building. Serves tasty chicken rolls, burgers, sandwiches, fresh juices, chowmein, hot tea, and coffee.',
    departments: ['Student Food & Hospitality'],
    facilities: ['Fast Service Counter', 'Outdoor Shaded Umbrella Tables', 'Cold Beverage Station'],
    timings: '9:00 AM - 9:00 PM (Daily)',
    tags: ['foodlicious', 'food', 'cafe', 'snacks', 'canteen', 'tea', 'coffee', 'eat', 'burger', 'roll'],
    status: 'Open'
  },

  // 3. Cafe Karigari (Active Primary Food Spot)
  {
    id: 'bldg-karigari',
    name: 'Cafe Karigari',
    bengaliName: 'ক্যাফে কারিগরী',
    shortName: 'Cafe Karigari',
    category: 'amenity',
    position: [112, 0, 32],
    size: [14, 5, 12],
    wallColor: '#fffbeb',
    accentColor: '#ea580c',
    roofColor: '#c2410c',
    floors: 1,
    description: 'Popular active university cafe located near the Fountain Plaza. Serves daily fresh meals, hot tea, specialty coffee, momos, rolls, fried snacks, and quick lunches for students and faculty.',
    departments: ['Student Food Services', 'Karigari Hospitality'],
    facilities: ['Indoor Air-Cooled Seating', 'Outdoor Garden Tables', 'Fast-Food Counter', 'Digital UPI Payments'],
    timings: '8:30 AM - 9:00 PM (Daily)',
    tags: ['cafe', 'karigari', 'food', 'canteen', 'tea', 'coffee', 'snacks', 'lunch', 'breakfast', 'eat'],
    status: 'Open'
  },

  // 4. Hydrogen (Active Food & Hangout Spot)
  {
    id: 'bldg-hydrogen',
    name: 'Hydrogen Cafe & Eatery',
    bengaliName: 'হাইড্রোজেন',
    shortName: 'Hydrogen',
    category: 'amenity',
    position: [110, 0, 10],
    size: [12, 5, 10],
    wallColor: '#fff7ed',
    accentColor: '#f97316',
    roofColor: '#ea580c',
    floors: 1,
    description: 'The bustling student hangout and food joint situated north of Cafe Karigari. Famous among hostelites and day scholars for evening tea, samosas, patties, cold drinks, and fast bites.',
    departments: ['Student Eatery & Snacks'],
    facilities: ['Outdoor Shaded Canopy', 'Snack Counter', 'Beverage Chiller', 'Evening Student Hangout Zone'],
    timings: '8:00 AM - 9:30 PM (Daily)',
    tags: ['hydrogen', 'cafe', 'food', 'tea', 'snacks', 'canteen', 'hangout', 'beverages', 'eat'],
    status: 'Open'
  },

  // 5. MAKAUT Fountain & Central Plaza
  {
    id: 'bldg-fountain',
    name: 'MAKAUT Fountain & Central Plaza',
    bengaliName: 'এমএকেএইউটি ফাউন্টেন',
    shortName: 'MAKAUT Fountain',
    category: 'amenity',
    position: [76, 0, 28],
    size: [48, 3, 48],
    wallColor: '#f8fafc',
    accentColor: '#0284c7',
    roofColor: '#047857',
    floors: 1,
    description: 'The iconic formal square university park with a centerpiece circular fountain basin, green water pool, four cardinal radial walking promenades, and 8 perimeter palm trees, enclosed by the entrance roundabout roadway.',
    departments: ['Campus Beautification & Landscape'],
    facilities: ['Circular Water Fountain Basin', 'Four Cardinal Promenade Walkways', 'Surrounding Square Park', 'Palm Tree Ring'],
    timings: 'Campus Grounds: 24 Hours (Fountain Mechanism Temporarily Closed)',
    tags: ['fountain', 'plaza', 'circle', 'roundabout', 'center', 'lawn', 'park'],
    status: 'Temporarily Closed'
  },

  // 6. Volleyball Court MAKAUT
  {
    id: 'bldg-volleyball',
    name: 'Volleyball Court MAKAUT',
    bengaliName: 'ভলিবল কোর্ট এমএকেএইউটি',
    shortName: 'Volleyball Court',
    category: 'amenity',
    position: [73, 0, 72],
    size: [18, 2, 26],
    wallColor: '#ca8a04',
    accentColor: '#16a34a',
    roofColor: '#ca8a04',
    floors: 1,
    description: 'Regulation clay volleyball court situated just south of the Fountain Plaza. Regularly used for inter-department matches and student evening practice.',
    departments: ['University Sports Board'],
    facilities: ['Regulation Volleyball Court with Net', 'Night Floodlights', 'Spectator Seating'],
    timings: '6:00 AM - 8:00 PM (Daily)',
    tags: ['volleyball', 'court', 'sports', 'game', 'ground', 'match', 'ball']
  },

  // 7. MAKAUT BioTech Building
  {
    id: 'bldg-biotech',
    name: 'MAKAUT Department of Biotechnology (BioTech Building)',
    bengaliName: 'ম্যাকাউট জৈবপ্রযুক্তি ভবন',
    shortName: 'BioTech Building',
    category: 'academic',
    position: [-23, 0, 130],
    size: [94, 18.5, 16],
    wallColor: '#6ba3d6', // Signature MAKAUT Sky Blue
    accentColor: '#f8fafc', // Crisp White Structural Columns
    roofColor: '#1d4ed8', // Royal Blue Parapet & Solar Arrays
    floors: 5,
    description: 'The flagship 5-story linear academic complex housing the Department of Biotechnology, Molecular Biology Labs, Bioinformatics Research Center, Rooftop Photovoltaic Solar Power Plant, and the central circular drop-off loop. Modeled with authentic MAKAUT Sky Blue walls, 14 white vertical column piers, "MAKAUT, W.B." entrance portico, and east elevator tower.',
    departments: [
      'Dept. of Biotechnology & Genetic Engineering',
      'Dept. of Bioinformatics & Computational Biology',
      'Dept. of Pharmaceutical Technology',
      'Molecular Biology & Genomics Research Center',
      'Bioprocess, Fermentation & Cell Culture Unit'
    ],
    facilities: [
      'State-of-the-art Genomics & Proteomics Labs',
      'Cell Culture & Fermentation Cleanrooms',
      'Bioinformatics High-Performance Server Suite',
      'Rooftop Photovoltaic Solar Power Array (100 kWp)',
      'Circular Drop-Off Driveway Loop & Landscaped Mound',
      'Central "MAKAUT, W.B." Entrance Portico & Foyer',
      'East Vertical Elevator & Stairwell Tower'
    ],
    timings: '9:00 AM - 6:30 PM (Mon - Sat)',
    tags: ['biotech', 'bio', 'pharma', 'bioinformatics', 'pharmaceutical', 'science', 'solar', 'lab', 'genomics', 'loop', 'portico']
  },

  // 8. MAKAUT Circular Academic Building (Exam Control Center & IEM)
  {
    id: 'bldg-industrial',
    name: 'MAKAUT Circular Academic Building (IEM & Exam Center)',
    bengaliName: 'ম্যাকাউট গোলাকার একাডেমিক ভবন (আইইএম ও পরীক্ষা নিয়ন্ত্রণ কেন্দ্র)',
    shortName: 'Circular Building (IEM & Exam)',
    category: 'academic',
    position: [70, 0, 122],
    size: [28, 15, 28],
    wallColor: '#f8fafc', // Pure Architectural White
    accentColor: '#1d4ed8', // MAKAUT Royal Blue Trims & Pilasters
    roofColor: '#1e40af', // 8-Faceted Royal Blue Pitched Roof
    floors: 2,
    description: 'Iconic 2-story circular landmark located east of the BioTech Building. Features a cylindrical white drum with royal blue structural pilasters, a projecting northwest 2-story dark glass curtain wall entrance tower with cantilevered portico, 8-faceted central pitched royal blue metal roof, concentric semi-circular granite entrance steps, and vibrant red-and-yellow checkered plaza with a 4x5 shade tree grove.',
    departments: [
      'Office of the Controller of Examinations (COE)',
      'Confidential Exam Processing & Central Evaluation Cell',
      'Dept. of Industrial Engineering & Management (IEM)',
      'Quality Assurance & Academic Affairs'
    ],
    facilities: [
      '2-Story Cylindrical Architectural Drum & 16 Radial Blue Pilasters',
      'Full-Height 2-Story Dark Reflective Glass Curtain Wall Entrance Tower',
      'Central 8-Faceted Pitched Royal Blue Metal Roof with Ventilator Cap',
      'Concentric Semi-Circular Granite Entrance Steps & Accessibility Ramp',
      'Red & Yellow Checkered Plaza with Raised Circular Tree Planter',
      'North Paved Plaza with 4x5 Shade Tree Grove',
      'Central Air-Conditioned Confidential Examination Depository & Halls'
    ],
    timings: '9:30 AM - 6:00 PM (Mon - Sat)',
    tags: ['round', 'circular', 'drum', 'cylinder', 'dome', 'exam', 'coe', 'controller', 'evaluation', 'iem', 'industrial', 'engineering', 'curtain', 'glass', 'results', 'auditorium']
  },

  // 9. Main Gate on NH-12
  {
    id: 'bldg-gate',
    name: 'MAKAUT Main Gate (WBUT)',
    bengaliName: 'এমএকেএইউটি মেইন গেট (ডাবলিউবিইউটি)',
    shortName: 'Main Gate (NH-12)',
    category: 'amenity',
    position: [156, 0, 41],
    size: [8, 11.5, 22],
    wallColor: '#38bdf8', // MAKAUT Sky Blue
    accentColor: '#1d4ed8', // Royal Blue
    roofColor: '#1e3a8a',
    floors: 1,
    description: 'The monumental main university entrance on NH-12 (Simhat, Haringhata). Features the iconic 20m sweeping curved blue canopy arch with 3D university lettering, left geometric chevron monument with official University Crest shield, sky blue security guard cabin, royal palm trees, yellow admissions billboard, motorized boom barrier, and roadway checkpoint.',
    departments: ['Campus Security Protocol Desk', 'Visitor Registration & Checkpost'],
    facilities: [
      '20m Sweeping Curved Blue Canopy Arch & 3D Typography',
      'Official MAKAUT / WBUT University Crest & Geometric Chevron Monument',
      '24x7 Security Guard Cabin & Surveillance Post',
      'Large University Admissions & Program Billboard',
      'Motorized Boom Barriers & Crowd Control Barricades',
      'NH-12 Bus, Auto-Rickshaw & E-Rickshaw Stand'
    ],
    timings: 'Open 24 Hours',
    tags: ['gate', 'entry', 'exit', 'nh12', 'wbut', 'arch', 'monument', 'crest', 'security', 'bus', 'dalkhola', 'simhat']
  },

  // 10. Sport's Ground
  {
    id: 'bldg-sports',
    name: 'MAKAUT Sport\'s Ground',
    bengaliName: 'ম্যাকাউট খেলার মাঠ',
    shortName: 'Sport\'s Ground',
    category: 'amenity',
    position: [-65, 0, -40],
    size: [55, 2, 45],
    wallColor: '#22c55e',
    accentColor: '#15803d',
    roofColor: '#166534',
    floors: 1,
    description: 'Large central outdoor natural grass stadium for university cricket tournaments, football leagues, annual athletic meets, and sports practice.',
    departments: ['University Sports Board'],
    facilities: ['Full Football Field', 'Cricket Pitch & Nets', 'Athletic Running Track'],
    timings: '6:00 AM - 7:30 PM (Daily)',
    tags: ['sports', 'ground', 'football', 'cricket', 'field', 'athletics', 'stadium']
  },

  // 11. Power Sub Station (MAKAUT) - NEW from NW map
  {
    id: 'bldg-substation',
    name: 'Power Sub Station (MAKAUT)',
    bengaliName: 'পাওয়ার সাব স্টেশন (এমএকেএইউটি)',
    shortName: 'Power Sub Station',
    category: 'admin',
    position: [-285, 0, -210],
    size: [16, 6, 14],
    wallColor: '#cbd5e1',
    accentColor: '#eab308',   // High-voltage caution yellow
    roofColor: '#475569',
    floors: 1,
    description: 'The dedicated on-campus 33/11kV electrical power sub-station providing regulated power distribution, transformers, and emergency backup generator systems across the campus.',
    departments: ['Electrical Infrastructure & Campus Engineering Unit'],
    facilities: ['Step-Down Transformers', 'High-Tension Switchgear Yard', 'Diesel Generator Backup', 'Control Room'],
    timings: 'Restricted Utility Facility (24x7 Staffed)',
    tags: ['power', 'substation', 'electricity', 'transformer', 'generator', 'utility']
  },

  // 12. MAKAUT Boys' Hostel (North-West)
  {
    id: 'bldg-hostel-boys',
    name: 'MAKAUT Boys\' Hostel',
    bengaliName: 'এমএকেএইউটি বয়েজ হোস্টেল',
    shortName: 'Boys\' Hostel',
    category: 'hostel',
    position: [-222, 0, -183],
    size: [56, 18, 52],
    wallColor: '#f1f5f9',
    accentColor: '#991b1b',
    roofColor: '#334155',
    floors: 5,
    description: 'Distinctive multi-wing residential complex for male students featuring an angled north-west spine, east wing, dual flanking residential wings enclosing a landscaped courtyard garden, and a 6-array rooftop solar photovoltaic farm.',
    departments: ['Boys\' Hostel Warden Desk', 'Mess Committee'],
    facilities: ['Furnished Student Rooms', 'Internal Landscaped Courtyard', 'Rooftop Solar Photovoltaic Array (6 Blocks)', 'Study Hall & Common Room', 'Gym'],
    timings: 'In-time: 9:30 PM',
    tags: ['hostel', 'boys hostel', 'residence', 'accommodation', 'rooms', 'solar', 'courtyard']
  },

  // 13. MAKAUT Boy's Canteen (Temporarily closed)
  {
    id: 'bldg-boys-canteen',
    name: 'MAKAUT Boy\'s Canteen (Temporarily Closed)',
    bengaliName: 'এমএকেএইউটি বয় এস ক্যান্টিন',
    shortName: 'Boy\'s Canteen',
    category: 'amenity',
    position: [-250, 0, -150],
    size: [14, 5, 12],
    wallColor: '#e2e8f0',
    accentColor: '#64748b',
    roofColor: '#475569',
    floors: 1,
    description: 'The standalone canteen facility adjacent to the Boys\' Hostel. Note: Currently temporarily closed for service; students use Cafe Karigari & Hydrogen for food.',
    departments: ['Canteen Services'],
    facilities: ['Dining Hall', 'Kitchen Unit'],
    timings: 'Temporarily Closed',
    tags: ['canteen', 'boys canteen', 'closed', 'food'],
    status: 'Temporarily Closed'
  },

  // 14. Faculty Building (West)
  {
    id: 'bldg-faculty',
    name: 'Faculty Building',
    bengaliName: 'ফ্যাকাল্টি বিল্ডিং',
    shortName: 'Faculty Building',
    category: 'admin',
    position: [-158, 0, 96],
    size: [32, 16, 16],
    wallColor: '#f8fafc',
    accentColor: '#475569',
    roofColor: '#334155',
    floors: 4,
    description: 'Dedicated residential complex for university professors, research fellows, and departmental heads featuring angled facade geometry, stepped cantilevered sunshade louvers, and rooftop water reserves, situated adjacent to Staff Quarters 2.',
    departments: ['Faculty Housing & Welfare Board'],
    facilities: ['Professor Family Apartments', 'Stepped Sunshade Louvers', 'Attached Car Parking', 'Courtyard Garden'],
    timings: 'Residential Area',
    tags: ['faculty', 'professors', 'building', 'residence', 'housing', 'quarters']
  },

  // 15. MAKAUT STAFF QUATER 2 (West)
  {
    id: 'bldg-staff-q2',
    name: 'MAKAUT STAFF QUATER 2',
    bengaliName: 'মাকসুদ স্টাফ কাতার ২',
    shortName: 'Staff Quarters 2',
    category: 'admin',
    position: [-122, 0, 108],
    size: [30, 16, 16],
    wallColor: '#f8fafc',
    accentColor: '#475569',
    roofColor: '#334155',
    floors: 4,
    description: 'Angled residential quarters block facing the Faculty Building across the central access avenue, featuring modern stepped sunshade facades, rooftop water reserves, and the Staff Quarters North block with 8 rooftop solar arrays.',
    departments: ['Staff Housing Board'],
    facilities: ['Residential Staff Apartments', 'Stepped Sunshade Balconies', 'Rooftop Solar Array (8 Blocks)', 'Internal Courtyard Garden'],
    timings: 'Residential Area',
    tags: ['staff', 'quarter', 'housing', 'quater 2', 'residence', 'solar']
  },

  // 16. Girls' Hostel (South-West)
  {
    id: 'bldg-hostel-girls',
    name: 'MAKAUT Girls\' Hostel',
    bengaliName: 'ম্যাকসুদ গার্লস হোস্টেল',
    shortName: 'Girls\' Hostel',
    category: 'hostel',
    position: [-100, 0, 150],
    size: [36, 16, 24],
    wallColor: '#f1f5f9',
    accentColor: '#9d174d',
    roofColor: '#334155',
    floors: 4,
    description: 'Dedicated residential complex for female scholars with 24/7 security guard post, resident wardens, in-house dining hall, and private landscaped courtyard.',
    departments: ['Girls\' Hostel Warden Office'],
    facilities: ['Dedicated Dining Mess', 'Study Rooms', 'Biometric Security Access'],
    timings: 'In-time: 9:00 PM',
    tags: ['hostel', 'girls hostel', 'residence', 'mess', 'accommodation']
  }
];

export const PRESET_VIEWS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    position: [-60, 260, 260],
    target: [-60, 0, 0]
  },
  crescent: {
    position: [35, 50, 15],
    target: [-3, 8, 7]
  },
  academic: {
    position: [35, 45, 65],
    target: [-3, 8, 46]
  },
  admin: {
    position: [35, 45, -35],
    target: [-1, 8, -31]
  },
  cafes: {
    position: [135, 28, 30],
    target: [112, 0, 22]
  },
  amenity: {
    position: [135, 28, 30],
    target: [112, 0, 22]
  },
  hostels: {
    position: [-180, 70, -130],
    target: [-222, 0, -183]
  },
  hostel: {
    position: [-180, 70, -130],
    target: [-222, 0, -183]
  },
  sports: {
    position: [-35, 55, -20],
    target: [-65, 0, -40]
  },
  nw: {
    position: [-180, 80, -130],
    target: [-240, 0, -160]
  }
};
