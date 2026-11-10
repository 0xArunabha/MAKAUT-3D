# MAKAUT 3D — Interactive Campus Digital Twin 🎓

An interactive, photorealistic 3D digital twin and wayfinding platform for the **Maulana Abul Kalam Azad University of Technology (MAKAUT)** Haringhata Main Campus. Built with **Three.js**, **TypeScript**, and **Vite**.

![MAKAUT 3D](public/favicon.svg)

---

## ✨ Features

### 🏛️ Authentic Architectural Reconstructions
* **Main Academic Crescent Complex**: Sweeping crescent wing in MAKAUT sky-blue with royal blue trims, 4-story glass atrium concourse, and rooftop radio beacon.
* **Administrative Building & Central Library**: Detailed multi-story admin blocks, reading halls, and plaza connections.
* **Circular Academic Building (IEM & Exam Centre)**: 2-story cylindrical academic drum, northwest glazed entrance tower, cantilevered portico, semi-circular granite entrance steps, accessible wheelchair ramp, airflow louvers, and rooftop utilities.
* **MAKAUT Main Gate (WBUT)**: Iconic curved arch gateway with standing 3D block letters on the crown, front and rear girder signage, Bengali monument plaque, and security cabins.
* **BioTech Complex, Hostels & Quarters**: BioTech labs, boys' and girls' hostels, sports grounds, and dining spots.

### 🌅 Visual Polish & Atmospheric Engine
* **360° Atmospheric Sky Dome**: Custom GLSL shader with Rayleigh scattering, dynamic sun disc, procedural drifting cumulus clouds, and a midnight starry night sky with glowing moon.
* **Procedural PBR Textures**: High-resolution procedural grass with bump micro-relief, aggregate asphalt roadways, and interlocking stone pavers.
* **Natural Radiance & Bounce Lighting**: Dual hemispherical lighting (sky blue + grass bounce) and soft PCF shadow mapping.
* **Day & Night Modes**: Seamless transitions between bright sunny daytime and illuminated night mode with streetlamps and building glows.

### 🧭 Navigation & Interactive Wayfinding
* **Route Finder**: Interactive graph-based pathfinding with an illuminated animated ground route ribbon and step-by-step turn guidance.
* **First-Person Street View**: Explore the campus on foot at ground level with keyboard (WASD) and touch controls.
* **Cinematic Guided Tours & Camera Fly-To**: Smooth camera transitions to any building or landmark.
* **Instant Search Palette**: Fast keyboard-driven (`⌘K` / `Ctrl+K`) search across departments, labs, canteens, and hostels.

---

## 🛠️ Tech Stack

* **3D Engine**: [Three.js](https://threejs.org/) (WebGL 2.0)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Build Tool & Dev Server**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Animation**: [@tweenjs/tween.js](https://github.com/tweenjs/tween.js/)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/0xArunabha/MAKAUT-3D.git
   cd MAKAUT-3D
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 License

Created for educational, exploration, and navigation purposes for the students, faculty, and visitors of MAKAUT.
