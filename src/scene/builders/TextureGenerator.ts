import * as THREE from 'three';

/**
 * High-performance procedural PBR texture generator using HTML5 Canvas.
 * Creates seamless, tileable textures for grass, asphalt, pavers, and concrete.
 */
export class TextureGenerator {
  private static cachedTextures: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Generates a lush, multi-tonal tropical grass texture with organic blades and micro-variation.
   */
  public static createGrassTexture(): THREE.CanvasTexture {
    const key = 'grass_diffuse';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // 1. Base vibrant meadow green
    ctx.fillStyle = '#2d7a36';
    ctx.fillRect(0, 0, size, size);

    // 2. Multi-frequency organic color blotches (Perlin-like noise simulation)
    const blotchCount = 2000;
    const colors = [
      '#348e3e', '#23652c', '#3fa34b', '#2e8037',
      '#48b356', '#1c5423', '#5aa846', '#25702f'
    ];

    for (let i = 0; i < blotchCount; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 6 + Math.random() * 24;
      const col = colors[Math.floor(Math.random() * colors.length)];

      ctx.fillStyle = col;
      ctx.globalAlpha = 0.25 + Math.random() * 0.35;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Wrap-around for seamless tiling
      if (x - radius < 0) { ctx.beginPath(); ctx.arc(x + size, y, radius, 0, Math.PI * 2); ctx.fill(); }
      if (x + radius > size) { ctx.beginPath(); ctx.arc(x - size, y, radius, 0, Math.PI * 2); ctx.fill(); }
      if (y - radius < 0) { ctx.beginPath(); ctx.arc(x, y + size, radius, 0, Math.PI * 2); ctx.fill(); }
      if (y + radius > size) { ctx.beginPath(); ctx.arc(x, y - size, radius, 0, Math.PI * 2); ctx.fill(); }
    }

    // 3. Fine grass blade strokes
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const bladeLen = 3 + Math.random() * 6;
      const bladeAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;

      ctx.strokeStyle = Math.random() > 0.4 ? '#4ade80' : '#14532d';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(bladeAngle) * bladeLen, y + Math.sin(bladeAngle) * bladeLen);
      ctx.stroke();
    }

    // Reset alpha
    ctx.globalAlpha = 1.0;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Bump/roughness map for grass providing physical micro-relief under sunlight.
   */
  public static createGrassBumpMap(): THREE.CanvasTexture {
    const key = 'grass_bump';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Mid-gray base
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Random speckle noise for height variation
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 70;
      const val = Math.min(255, Math.max(0, 128 + noise));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Generates authentic asphalt texture with aggregate mineral flecks and micro-cracks.
   */
  public static createAsphaltTexture(): THREE.CanvasTexture {
    const key = 'asphalt_diffuse';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Dark charcoal asphalt base
    ctx.fillStyle = '#222831';
    ctx.fillRect(0, 0, size, size);

    // Multi-frequency aggregate stone speckles
    const speckleColors = ['#1a1f26', '#2d3748', '#394454', '#4a5568', '#14181f'];
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 0.8 + Math.random() * 2.2;
      ctx.fillStyle = speckleColors[Math.floor(Math.random() * speckleColors.length)];
      ctx.globalAlpha = 0.35 + Math.random() * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Bump map for asphalt to make specular highlights shimmer like real macadam.
   */
  public static createAsphaltBumpMap(): THREE.CanvasTexture {
    const key = 'asphalt_bump';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 60;
      const val = Math.min(255, Math.max(0, 128 + noise));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Interlocking sidewalk / pedestrian paver stone texture with grout seams.
   */
  public static createPaverTexture(): THREE.CanvasTexture {
    const key = 'paver_diffuse';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Mortar/grout base
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, size, size);

    // Paver grid
    const cols = 8;
    const rows = 8;
    const tileW = size / cols;
    const tileH = size / rows;
    const gap = 3;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Offset alternate rows for running bond
        const offset = (r % 2 === 0) ? 0 : tileW / 2;
        const x = (c * tileW + offset) % size;
        const y = r * tileH;

        // Subtle variation in paver stone tone
        const baseTone = 210 + Math.floor(Math.random() * 30);
        ctx.fillStyle = `rgb(${baseTone}, ${baseTone - 4}, ${baseTone - 10})`;
        ctx.fillRect(x + gap / 2, y + gap / 2, tileW - gap, tileH - gap);

        // Micro-grit on pavers
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        for (let k = 0; k < 12; k++) {
          ctx.fillRect(
            x + gap / 2 + Math.random() * (tileW - gap),
            y + gap / 2 + Math.random() * (tileH - gap),
            2, 2
          );
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Architectural concrete texture for boundary walls, curbs, and plinths.
   */
  public static createConcreteTexture(): THREE.CanvasTexture {
    const key = 'concrete_diffuse';
    if (this.cachedTextures.has(key)) return this.cachedTextures.get(key)!;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, size, size);

    // Weathering stains and subtle pores
    ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const w = 4 + Math.random() * 20;
      const h = 2 + Math.random() * 8;
      ctx.fillRect(x, y, w, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }
}
