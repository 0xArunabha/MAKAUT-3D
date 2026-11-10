const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generateIconPNG(size, filename) {
  const width = size;
  const height = size;
  const raw = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    raw[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Coordinate from center (-1 to 1)
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const dist = Math.hypot(nx, ny);

      // Squircle corner mask (superellipse)
      const squircle = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);
      if (squircle > 0.88) {
        raw[pxOffset] = 0;
        raw[pxOffset + 1] = 0;
        raw[pxOffset + 2] = 0;
        raw[pxOffset + 3] = 0; // transparent outside rounded app icon
        continue;
      }

      // Background gradient: Rich Blue to Deep Indigo
      const t = (nx + ny + 2) / 4;
      let r = Math.round(30 + t * 25);
      let g = Math.round(58 + t * 45);
      let b = Math.round(180 + t * 65);

      // Draw stylized 3D "M" block motif in center
      const inCenterX = Math.abs(nx) < 0.58;
      const inCenterY = Math.abs(ny) < 0.58;

      if (inCenterX && inCenterY) {
        // Vertical pillars of 'M'
        const isLeftPillar = nx >= -0.52 && nx <= -0.28 && ny >= -0.45 && ny <= 0.45;
        const isRightPillar = nx >= 0.28 && nx <= 0.52 && ny >= -0.45 && ny <= 0.45;

        // Diagonal chevrons of 'M'
        const diagLeft = Math.abs((ny - (-0.45)) - (nx - (-0.3)) * 1.6) < 0.18 && nx >= -0.32 && nx <= 0.02 && ny <= 0.25;
        const diagRight = Math.abs((ny - (-0.45)) + (nx - 0.3) * 1.6) < 0.18 && nx >= -0.02 && nx <= 0.32 && ny <= 0.25;

        if (isLeftPillar || isRightPillar || diagLeft || diagRight) {
          // Pure Crisp White with cyan shading
          r = 248;
          g = 250;
          b = 252;
        }
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idatData = zlib.deflateSync(raw, { level: 9 });
  const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const finalPng = Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, finalPng);
  console.log(`Generated ${filename} (${finalPng.length} bytes)`);
}

generateIconPNG(192, 'public/icon-192.png');
generateIconPNG(512, 'public/icon-512.png');
generateIconPNG(192, 'public/icon-maskable-192.png');
generateIconPNG(512, 'public/icon-maskable-512.png');
