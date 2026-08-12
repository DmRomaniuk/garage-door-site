// Generates stylized SVG placeholder images (replace with real photos later).
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public/images", { recursive: true });

const door = (x, y, w, h, panels, fill, line, windows = false, glass = "#9fb6c9") => {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}"/>`;
  const ph = h / panels;
  for (let i = 0; i < panels; i++) {
    const py = y + i * ph;
    s += `<rect x="${x + 6}" y="${py + 5}" width="${w - 12}" height="${ph - 10}" rx="4" fill="none" stroke="${line}" stroke-width="2" opacity="0.55"/>`;
    if (windows && i === 0) {
      const n = 4, ww = (w - 40) / n;
      for (let j = 0; j < n; j++)
        s += `<rect x="${x + 20 + j * ww + 4}" y="${py + ph * 0.25}" width="${ww - 8}" height="${ph * 0.5}" rx="3" fill="${glass}" opacity="0.9"/>`;
    }
  }
  return s;
};

const scene = ({ sky1, sky2, wall, doorFill, doorLine, accent, windows, panels = 4, glassDoor = false }) => {
  const doorArt = glassDoor
    ? (() => {
        let s = `<rect x="340" y="300" width="520" height="330" rx="8" fill="#10161f"/>`;
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 4; c++)
            s += `<rect x="${352 + c * 126}" y="${312 + r * 80}" width="114" height="68" rx="4" fill="#8fa8bd" opacity="${0.75 - r * 0.08}"/>`;
        return s;
      })()
    : door(340, 300, 520, 330, panels, doorFill, doorLine, windows);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/>
</linearGradient>
<linearGradient id="drv" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2a333f"/><stop offset="1" stop-color="#1a212b"/>
</linearGradient>
</defs>
<rect width="1200" height="800" fill="url(#sky)"/>
<circle cx="980" cy="150" r="200" fill="${accent}" opacity="0.14"/>
<circle cx="980" cy="150" r="120" fill="${accent}" opacity="0.12"/>
<!-- house body -->
<rect x="260" y="240" width="680" height="400" fill="${wall}"/>
<polygon points="230,240 600,120 970,240" fill="${wall}" opacity="0.92"/>
<polygon points="230,240 600,120 970,240 970,254 230,254" fill="#0c1219"/>
<!-- side windows -->
<rect x="285" y="330" width="40" height="90" rx="3" fill="#8fa8bd" opacity="0.55"/>
<rect x="875" y="330" width="40" height="90" rx="3" fill="#8fa8bd" opacity="0.55"/>
<!-- door frame -->
<rect x="326" y="286" width="548" height="354" rx="10" fill="#0c1219"/>
${doorArt}
<!-- lamps -->
<circle cx="310" cy="300" r="9" fill="${accent}"/>
<circle cx="890" cy="300" r="9" fill="${accent}"/>
<!-- driveway -->
<rect x="0" y="640" width="1200" height="160" fill="url(#drv)"/>
<polygon points="340,640 860,640 1010,800 190,800" fill="#232c38"/>
<line x1="600" y1="640" x2="600" y2="800" stroke="#31404f" stroke-width="3" opacity="0.5"/>
</svg>`;
};

const palettes = {
  dusk: { sky1: "#131b25", sky2: "#2e3c4c", accent: "#ff9e2b" },
  dawn: { sky1: "#1e2936", sky2: "#4f6379", accent: "#ffc164" },
  night: { sky1: "#0a0f16", sky2: "#1e2936", accent: "#ff9e2b" },
};

// Damaged-door scene for the before/after demo slider.
const damagedScene = () => {
  let door = `<rect x="340" y="300" width="520" height="330" rx="6" fill="#8a95a3"/>`;
  const panels = [
    { y: 305, skew: -3, dx: 8 },
    { y: 388, skew: 5, dx: -14 },
    { y: 471, skew: -7, dx: 20 },
    { y: 554, skew: 2, dx: -6 },
  ];
  for (const p of panels) {
    door += `<rect x="${346 + p.dx}" y="${p.y}" width="508" height="72" rx="4" fill="none" stroke="#5c6875" stroke-width="3" transform="rotate(${p.skew} 600 ${p.y + 36})" opacity="0.8"/>`;
  }
  door += `<polyline points="420,320 470,420 440,500 500,610" fill="none" stroke="#3c4650" stroke-width="5" stroke-linecap="round"/>`;
  door += `<polyline points="720,310 690,430 740,520" fill="none" stroke="#3c4650" stroke-width="4" stroke-linecap="round"/>`;
  door += `<rect x="500" y="560" width="140" height="60" rx="6" fill="#4a5560" transform="rotate(-6 570 590)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131b25"/><stop offset="1" stop-color="#2e3c4c"/></linearGradient>
<linearGradient id="drv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a333f"/><stop offset="1" stop-color="#1a212b"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#sky)"/>
<circle cx="980" cy="150" r="200" fill="#71859c" opacity="0.1"/>
<rect x="260" y="240" width="680" height="400" fill="#3a4a5c"/>
<polygon points="230,240 600,120 970,240" fill="#3a4a5c" opacity="0.92"/>
<polygon points="230,240 600,120 970,240 970,254 230,254" fill="#0c1219"/>
<rect x="285" y="330" width="40" height="90" rx="3" fill="#5f7488" opacity="0.5"/>
<rect x="875" y="330" width="40" height="90" rx="3" fill="#5f7488" opacity="0.5"/>
<rect x="326" y="286" width="548" height="354" rx="10" fill="#0c1219"/>
${door}
<circle cx="310" cy="300" r="9" fill="#5c6875"/>
<circle cx="890" cy="300" r="9" fill="#ff9e2b"/>
<rect x="0" y="640" width="1200" height="160" fill="url(#drv)"/>
<polygon points="340,640 860,640 1010,800 190,800" fill="#232c38"/>
</svg>`;
};

const images = {
  "gallery-6-before.svg": damagedScene(),
  "hero.svg": scene({ ...palettes.dusk, wall: "#3c4d60", doorFill: "#e8ecf1", doorLine: "#a3b2c2", windows: true }),
  "service-installation.svg": scene({ ...palettes.dawn, wall: "#2e3c4c", doorFill: "#dfe6ee", doorLine: "#8fa0b3", windows: true }),
  "service-repair.svg": scene({ ...palettes.dusk, wall: "#43556a", doorFill: "#c9d3de", doorLine: "#71859c", panels: 5 }),
  "service-springs.svg": scene({ ...palettes.night, wall: "#2e3c4c", doorFill: "#aab8c6", doorLine: "#71859c", panels: 3 }),
  "service-opener.svg": scene({ ...palettes.dawn, wall: "#3c4d60", glassDoor: true }),
  "service-maintenance.svg": scene({ ...palettes.dusk, wall: "#354657", doorFill: "#e8ded0", doorLine: "#b8a88f", windows: true }),
  "service-emergency.svg": scene({ ...palettes.night, wall: "#1e2936", doorFill: "#d8dee6", doorLine: "#8fa0b3", panels: 4 }),
  "gallery-1.svg": scene({ ...palettes.dusk, wall: "#26303c", glassDoor: true }),
  "gallery-2.svg": scene({ ...palettes.dawn, wall: "#4a5c70", doorFill: "#e3d9c8", doorLine: "#a8977c", windows: true, panels: 3 }),
  "gallery-3.svg": scene({ ...palettes.dusk, wall: "#3c4d60", doorFill: "#eef1f5", doorLine: "#a3b2c2", windows: true }),
  "gallery-4.svg": scene({ ...palettes.night, wall: "#2e3c4c", doorFill: "#b8c4d0", doorLine: "#71859c", panels: 5 }),
  "gallery-5.svg": scene({ ...palettes.dawn, wall: "#33455a", glassDoor: true }),
  "gallery-6.svg": scene({ ...palettes.dusk, wall: "#405266", doorFill: "#cfd8e2", doorLine: "#8fa0b3", panels: 4 }),
};

for (const [name, svg] of Object.entries(images)) writeFileSync(`public/images/${name}`, svg);
console.log(`Generated ${Object.keys(images).length} images`);
