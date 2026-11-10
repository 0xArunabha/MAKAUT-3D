export interface NavWaypoint {
  id: string;
  name: string;
  position: [number, number, number];
  buildingId?: string;
  neighbors: string[];
}

export const CAMPUS_WAYPOINTS: Record<string, NavWaypoint> = {
  // 1. Main Gate on NH-12
  'wp-gate': {
    id: 'wp-gate',
    name: 'MAKAUT Main Gate (NH-12)',
    position: [156, 0, 41],
    buildingId: 'bldg-gate',
    neighbors: ['wp-gate-avenue-mid']
  },

  // 2. Entrance Avenue (Between Gate and Plaza)
  'wp-gate-avenue-mid': {
    id: 'wp-gate-avenue-mid',
    name: 'Entrance Avenue (Midpoint)',
    position: [116, 0, 35],
    neighbors: ['wp-gate', 'wp-karigari-entrance', 'wp-hydrogen-entrance', 'wp-plaza-east']
  },

  // 3. Cafe Karigari (Active Canteen/Food spot)
  'wp-karigari-entrance': {
    id: 'wp-karigari-entrance',
    name: 'Cafe Karigari Entrance',
    position: [112, 0, 32],
    buildingId: 'bldg-karigari',
    neighbors: ['wp-gate-avenue-mid', 'wp-hydrogen-entrance', 'wp-plaza-east']
  },

  // 4. Hydrogen Eatery (Active Canteen/Food spot)
  'wp-hydrogen-entrance': {
    id: 'wp-hydrogen-entrance',
    name: 'Hydrogen Eatery & Snacks Counter',
    position: [110, 0, 10],
    buildingId: 'bldg-hydrogen',
    neighbors: ['wp-gate-avenue-mid', 'wp-karigari-entrance', 'wp-plaza-north']
  },

  // 5. Entrance Plaza East Entrance
  'wp-plaza-east': {
    id: 'wp-plaza-east',
    name: 'Entrance Plaza East Entrance',
    position: [98, 0, 32],
    neighbors: ['wp-gate-avenue-mid', 'wp-karigari-entrance', 'wp-gate-plaza', 'wp-plaza-north', 'wp-plaza-south']
  },

  // 6. Formal Entrance Plaza & Centerpiece Fountain
  'wp-gate-plaza': {
    id: 'wp-gate-plaza',
    name: 'MAKAUT Fountain & Central Plaza',
    position: [76, 0, 28],
    buildingId: 'bldg-fountain',
    neighbors: ['wp-plaza-east', 'wp-plaza-north', 'wp-plaza-south', 'wp-plaza-west']
  },

  // 7. Plaza North Arc
  'wp-plaza-north': {
    id: 'wp-plaza-north',
    name: 'Entrance Plaza (North Arc)',
    position: [76, 0, 5],
    neighbors: ['wp-plaza-east', 'wp-gate-plaza', 'wp-plaza-west', 'wp-hydrogen-entrance']
  },

  // 8. Plaza South Arc
  'wp-plaza-south': {
    id: 'wp-plaza-south',
    name: 'Entrance Plaza (South Arc)',
    position: [76, 0, 52],
    neighbors: ['wp-plaza-east', 'wp-gate-plaza', 'wp-plaza-west', 'wp-volleyball-entrance', 'wp-industrial-entrance']
  },

  // 9. Plaza West Exit toward Crescent
  'wp-plaza-west': {
    id: 'wp-plaza-west',
    name: 'Entrance Plaza West Exit',
    position: [52, 0, 25],
    neighbors: ['wp-gate-plaza', 'wp-plaza-north', 'wp-plaza-south', 'wp-crescent-east']
  },

  // 10. Volleyball Court
  'wp-volleyball-entrance': {
    id: 'wp-volleyball-entrance',
    name: 'Volleyball Court Pavilion',
    position: [73, 0, 68],
    buildingId: 'bldg-volleyball',
    neighbors: ['wp-plaza-south', 'wp-industrial-entrance']
  },

  // 11. Circular Academic Building (Exam Control Center & IEM)
  'wp-industrial-entrance': {
    id: 'wp-industrial-entrance',
    name: 'Circular Academic Building Entrance Plaza',
    position: [58, 0, 110],
    buildingId: 'bldg-industrial',
    neighbors: ['wp-plaza-south', 'wp-volleyball-entrance', 'wp-biotech-entrance']
  },

  // 12. Main Crescent Building Concourse
  'wp-crescent-east': {
    id: 'wp-crescent-east',
    name: 'Main Complex East Entrance Concourse',
    position: [18, 0, 12],
    neighbors: ['wp-plaza-west', 'wp-crescent-atrium', 'wp-admin-crescent', 'wp-acad-crescent']
  },

  // 13. Central Grand Atrium & Concourse
  'wp-crescent-atrium': {
    id: 'wp-crescent-atrium',
    name: 'Central Grand Glazed Atrium',
    position: [-3, 0, 7],
    neighbors: ['wp-crescent-east', 'wp-admin-crescent', 'wp-acad-crescent', 'wp-library-entrance', 'wp-central-spine-mid']
  },

  // 13b. Central Library & FM 90.0 Radio Station Entrance (North Concourse)
  'wp-library-entrance': {
    id: 'wp-library-entrance',
    name: 'MAKAUT Central Library Main Entrance',
    position: [-25.5, 0, 4.3],
    buildingId: 'bldg-library',
    neighbors: ['wp-central-spine-mid', 'wp-crescent-atrium', 'wp-admin-crescent']
  },

  // 14. Administrative Building (North Crescent)
  'wp-admin-crescent': {
    id: 'wp-admin-crescent',
    name: 'Administrative Building (North Crescent)',
    position: [-4, 0, -28],
    buildingId: 'bldg-admin-north',
    neighbors: ['wp-crescent-east', 'wp-crescent-atrium', 'wp-library-entrance', 'wp-central-spine-north']
  },

  // 15. Academic Building (North Concourse & South Entrance)
  'wp-acad-crescent': {
    id: 'wp-acad-crescent',
    name: 'Academic Building (North Concourse Arcade)',
    position: [-14.8, 0, 44],
    buildingId: 'bldg-acad-south',
    neighbors: ['wp-crescent-east', 'wp-crescent-atrium', 'wp-library-entrance', 'wp-acad-south-entrance']
  },

  'wp-acad-south-entrance': {
    id: 'wp-acad-south-entrance',
    name: 'Academic Building South Entrance & Mosaic Mural',
    position: [-14.8, 0, 64],
    buildingId: 'bldg-acad-south',
    neighbors: ['wp-acad-crescent', 'wp-central-spine-south']
  },

  // 16. Central Spine Avenue (North-South)
  'wp-central-spine-mid': {
    id: 'wp-central-spine-mid',
    name: 'Central Campus Spine Avenue',
    position: [-3, 0, 7],
    neighbors: ['wp-crescent-atrium', 'wp-central-spine-north', 'wp-central-spine-south', 'wp-sports-east']
  },

  // 17. Central Avenue Northbound
  'wp-central-spine-north': {
    id: 'wp-central-spine-north',
    name: 'Central Avenue (Northbound)',
    position: [-3, 0, -40],
    neighbors: ['wp-central-spine-mid', 'wp-admin-crescent', 'wp-sports-entrance', 'wp-north-spine-junc', 'wp-foodlicious']
  },

  // 17b. Foodlicious Kiosk & Dining Apron
  'wp-foodlicious': {
    id: 'wp-foodlicious',
    name: 'Foodlicious Cafe & Eatery',
    position: [-56, 0, -16],
    buildingId: 'bldg-foodlicious',
    neighbors: ['wp-central-spine-north', 'wp-sports-east']
  },

  // 18. Sports Ground East Path
  'wp-sports-east': {
    id: 'wp-sports-east',
    name: 'Sport\'s Ground East Path',
    position: [-30, 0, -15],
    neighbors: ['wp-central-spine-mid', 'wp-sports-entrance', 'wp-foodlicious']
  },

  // 19. Sports Ground Main Entrance
  'wp-sports-entrance': {
    id: 'wp-sports-entrance',
    name: 'MAKAUT Sport\'s Ground Main Pavilion',
    position: [-60, 0, -40],
    buildingId: 'bldg-sports',
    neighbors: ['wp-sports-east', 'wp-central-spine-north', 'wp-hostel-driveway-base']
  },

  // 20. Central Avenue Southbound toward BioTech
  'wp-central-spine-south': {
    id: 'wp-central-spine-south',
    name: 'Central Avenue (South to BioTech)',
    position: [-14.8, 0, 80],
    neighbors: ['wp-central-spine-mid', 'wp-acad-south-entrance', 'wp-biotech-circle', 'wp-west-cross-road']
  },

  // 21. BioTech Circular Drop-Off Driveway Loop
  'wp-biotech-circle': {
    id: 'wp-biotech-circle',
    name: 'BioTech Circular Drop-Off Loop',
    position: [-23, 0, 98],
    neighbors: ['wp-central-spine-south', 'wp-biotech-entrance', 'wp-south-ring-mid']
  },

  // 22. BioTech Building Entrance Portico
  'wp-biotech-entrance': {
    id: 'wp-biotech-entrance',
    name: 'BioTech Building Main Entrance (MAKAUT, W.B.)',
    position: [-23, 0, 122],
    buildingId: 'bldg-biotech',
    neighbors: ['wp-biotech-circle', 'wp-industrial-entrance', 'wp-south-ring-mid']
  },

  // 23. South Perimeter Road
  'wp-south-ring-mid': {
    id: 'wp-south-ring-mid',
    name: 'South Perimeter Road (BioTech & Girls Hostel)',
    position: [-60, 0, 135],
    neighbors: ['wp-biotech-circle', 'wp-biotech-entrance', 'wp-girls-hostel-entrance']
  },

  // 24. Girls' Hostel Entrance
  'wp-girls-hostel-entrance': {
    id: 'wp-girls-hostel-entrance',
    name: 'MAKAUT Girls\' Hostel Gate',
    position: [-95, 0, 145],
    buildingId: 'bldg-hostel-girls',
    neighbors: ['wp-south-ring-mid', 'wp-west-cross-road', 'wp-diamond-loop-south']
  },

  // 25. West Cross Road
  'wp-west-cross-road': {
    id: 'wp-west-cross-road',
    name: 'West Cross Road',
    position: [-60, 0, 95],
    neighbors: ['wp-central-spine-south', 'wp-girls-hostel-entrance', 'wp-diamond-loop-south']
  },

  // 26. Diamond-Shaped Loop for Staff Quarter 2 (South)
  'wp-diamond-loop-south': {
    id: 'wp-diamond-loop-south',
    name: 'Staff Quarter Diamond Loop (South)',
    position: [-124, 0, 122],
    neighbors: ['wp-west-cross-road', 'wp-girls-hostel-entrance', 'wp-staff-q2-entrance', 'wp-diamond-loop-north']
  },

  // 27. Staff Quarter 2 Entrance
  'wp-staff-q2-entrance': {
    id: 'wp-staff-q2-entrance',
    name: 'MAKAUT STAFF QUATER 2 Entrance',
    position: [-122, 0, 94],
    buildingId: 'bldg-staff-q2',
    neighbors: ['wp-diamond-loop-south', 'wp-diamond-loop-north', 'wp-faculty-entrance']
  },

  // 28. Crossroad Loop for Staff Quarters & Faculty (North)
  'wp-diamond-loop-north': {
    id: 'wp-diamond-loop-north',
    name: 'Staff Quarter & Faculty Crossroad',
    position: [-138, 0, 84],
    neighbors: ['wp-diamond-loop-south', 'wp-staff-q2-entrance', 'wp-faculty-entrance', 'wp-hostel-driveway-base']
  },

  // 29. Driveway North to Boys' Hostel Zone
  'wp-hostel-driveway-base': {
    id: 'wp-hostel-driveway-base',
    name: 'Hostel Access Spine',
    position: [-100, 0, 0],
    neighbors: ['wp-diamond-loop-north', 'wp-sports-entrance', 'wp-hostel-driveway-fork']
  },

  // 30. Faculty Building Entrance
  'wp-faculty-entrance': {
    id: 'wp-faculty-entrance',
    name: 'Faculty Building Entrance',
    position: [-158, 0, 84],
    buildingId: 'bldg-faculty',
    neighbors: ['wp-diamond-loop-north', 'wp-staff-q2-entrance', 'wp-west-cross-road']
  },

  // 31. Boys' Hostel & Canteen Fork
  'wp-hostel-driveway-fork': {
    id: 'wp-hostel-driveway-fork',
    name: 'Boys\' Hostel & Canteen Fork',
    position: [-180, 0, -120],
    neighbors: ['wp-hostel-driveway-base', 'wp-boys-canteen-entrance', 'wp-boys-hostel-entrance']
  },

  // 32. Boys' Canteen
  'wp-boys-canteen-entrance': {
    id: 'wp-boys-canteen-entrance',
    name: 'Boy\'s Canteen Entrance (Temporarily Closed)',
    position: [-245, 0, -145],
    buildingId: 'bldg-boys-canteen',
    neighbors: ['wp-hostel-driveway-fork', 'wp-substation-entrance']
  },

  // 33. Boys' Hostel Main Entrance
  'wp-boys-hostel-entrance': {
    id: 'wp-boys-hostel-entrance',
    name: 'Boys\' Hostel Main Entrance',
    position: [-215, 0, -175],
    buildingId: 'bldg-hostel-boys',
    neighbors: ['wp-hostel-driveway-fork', 'wp-substation-entrance']
  },

  // 34. Power Sub Station Gate
  'wp-substation-entrance': {
    id: 'wp-substation-entrance',
    name: 'Power Sub Station (MAKAUT) Gate',
    position: [-275, 0, -200],
    buildingId: 'bldg-substation',
    neighbors: ['wp-boys-canteen-entrance', 'wp-boys-hostel-entrance', 'wp-north-spine-junc']
  },

  // 35. North Perimeter Road
  'wp-north-spine-junc': {
    id: 'wp-north-spine-junc',
    name: 'North Perimeter Road Junction',
    position: [-150, 0, -160],
    neighbors: ['wp-central-spine-north', 'wp-substation-entrance']
  }
};
