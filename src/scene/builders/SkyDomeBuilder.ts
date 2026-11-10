import * as THREE from 'three';

/**
 * SkyDomeBuilder constructs a 360-degree atmospheric sky dome with realistic
 * day/night scattering, sun/moon discs, animated drifting clouds, and twinkling night stars.
 */
export class SkyDomeBuilder {
  private mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private currentNightTarget = 0.0;
  private currentNightMode = 0.0;

  constructor(scene: THREE.Scene) {
    const vertexShader = `
      varying vec3 vDirection;
      void main() {
        vDirection = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform vec3 dayTopColor;
      uniform vec3 dayMidColor;
      uniform vec3 dayHorizonColor;
      uniform vec3 nightTopColor;
      uniform vec3 nightMidColor;
      uniform vec3 nightHorizonColor;
      uniform vec3 sunPosition;
      uniform vec3 sunColor;
      uniform vec3 moonColor;
      uniform float nightMode;
      uniform float time;

      varying vec3 vDirection;

      // GLSL ES compliant 2D pseudo-random hash
      float hash(vec2 p) {
        vec2 q = fract(p * vec2(123.34, 456.21));
        float d = dot(q, q + vec2(45.32, 45.32));
        return fract(d * (d + 12.34));
      }

      void main() {
        vec3 dir = normalize(vDirection);
        float h = clamp(dir.y, 0.0, 1.0);

        // Day atmospheric gradient (Zenith -> Mid -> Horizon)
        vec3 daySky = mix(dayHorizonColor, dayMidColor, smoothstep(0.0, 0.35, h));
        daySky = mix(daySky, dayTopColor, smoothstep(0.35, 1.0, h));

        // Night atmospheric gradient
        vec3 nightSky = mix(nightHorizonColor, nightMidColor, smoothstep(0.0, 0.35, h));
        nightSky = mix(nightSky, nightTopColor, smoothstep(0.35, 1.0, h));

        // Blend between day and night
        vec3 sky = mix(daySky, nightSky, nightMode);

        // Sun disc and golden corona glow (Day)
        vec3 sunDir = normalize(sunPosition);
        float sunDot = max(0.0, dot(dir, sunDir));
        if (nightMode < 0.98) {
          float sunCorona = pow(sunDot, 32.0) * (1.0 - nightMode) * 0.6;
          float sunDisc = smoothstep(0.998, 0.9995, sunDot) * (1.0 - nightMode) * 2.5;
          sky += sunColor * (sunCorona + sunDisc);
        }

        // Moon disc and silvery blue corona (Night)
        vec3 moonDir = normalize(vec3(-sunPosition.x * 0.8, sunPosition.y * 0.75, -sunPosition.z * 0.8));
        float moonDot = max(0.0, dot(dir, moonDir));
        if (nightMode > 0.02) {
          float moonCorona = pow(moonDot, 24.0) * nightMode * 0.5;
          float moonDisc = smoothstep(0.9975, 0.999, moonDot) * nightMode * 2.0;
          sky += moonColor * (moonCorona + moonDisc);
        }

        // Procedural drifting clouds (Day)
        if (nightMode < 0.9 && dir.y > 0.02) {
          vec2 cloudCoord = (dir.xz / (dir.y + 0.12)) * 1.2;
          cloudCoord += vec2(time * 0.00003, time * 0.000015);
          
          float n1 = sin(cloudCoord.x * 2.2 + sin(cloudCoord.y * 2.8)) * 0.5 + 0.5;
          float n2 = cos(cloudCoord.x * 4.4 - cloudCoord.y * 3.6) * 0.5 + 0.5;
          float cloudDensity = smoothstep(0.58, 0.88, n1 * n2);
          float horizonFade = smoothstep(0.02, 0.28, dir.y);

          vec3 cloudColor = mix(vec3(0.92, 0.95, 1.0), vec3(1.0, 0.98, 0.94), sunDot * 0.5);
          sky = mix(sky, cloudColor, cloudDensity * horizonFade * 0.42 * (1.0 - nightMode));
        }

        // Twinkling stars (Night)
        if (nightMode > 0.05 && dir.y > 0.05) {
          vec2 starCoord = floor((dir.xz / (dir.y + 0.18)) * 380.0);
          float starVal = hash(starCoord);
          if (starVal > 0.994) {
            float twinkle = sin(time * 0.004 + starVal * 50.0) * 0.45 + 0.55;
            float starBrightness = (starVal - 0.994) * 180.0 * twinkle * nightMode * smoothstep(0.05, 0.35, dir.y);
            sky += vec3(0.9, 0.95, 1.0) * starBrightness;
          }
        }

        gl_FragColor = vec4(sky, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        dayTopColor: { value: new THREE.Color('#1d4ed8') },       // Deep zenith blue
        dayMidColor: { value: new THREE.Color('#60a5fa') },       // Vibrant azure sky
        dayHorizonColor: { value: new THREE.Color('#dbeafe') },   // Soft hazy horizon
        nightTopColor: { value: new THREE.Color('#030712') },     // Deep space black-blue
        nightMidColor: { value: new THREE.Color('#0f172a') },     // Midnight navy
        nightHorizonColor: { value: new THREE.Color('#1e293b') }, // Dark slate horizon
        sunPosition: { value: new THREE.Vector3(130, 230, 105) },
        sunColor: { value: new THREE.Color('#fffbeb') },
        moonColor: { value: new THREE.Color('#bae6fd') },
        nightMode: { value: 0.0 },
        time: { value: 0.0 }
      },
      side: THREE.BackSide,
      depthWrite: false
    });

    // 900m radius dome, centered dynamically on camera so it never clips with camera far (1400)
    const geometry = new THREE.SphereGeometry(900, 32, 20);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.name = 'atmospheric-sky-dome';
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  public setTheme(theme: 'day' | 'night') {
    this.currentNightTarget = theme === 'night' ? 1.0 : 0.0;
  }

  public update(time: number, camera?: THREE.Camera) {
    if (camera) {
      this.mesh.position.copy(camera.position);
    }
    this.material.uniforms.time.value = time;

    // Smooth lerp between day and night mode transitions
    if (Math.abs(this.currentNightMode - this.currentNightTarget) > 0.001) {
      this.currentNightMode += (this.currentNightTarget - this.currentNightMode) * 0.06;
      this.material.uniforms.nightMode.value = this.currentNightMode;
    }
  }
}
