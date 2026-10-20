import { ref, reactive, computed } from 'vue';

const images = import.meta.glob(
  '/src/assets/tools/*',
  {
    eager: true,
    import: 'default'
  }
)

export function getImg(name) {
  return images[`/src/assets/tools/${name}`]
}

export const canvasWidth = ref(16);
export const canvasHeight = ref(16);

export const canvasResizeTrigger = ref(0)
export const renderTrigger = ref(0);

export const selectedTool = ref(0);

export const runFunc = ref(null);
export const runErrorMessage = ref(null);

export const windowBlock = ref(true);

export const menuItems = [
  ["File", 
    ["New", "Shift + N"],
    ["Open", "Ctrl + O"],
    ["Save", "Ctrl + S"],
    ["Import", "Ctrl + I"],
    ["Import as Layer", ""],
    ["Export", "Ctrl + E"],
    ["Resize", "", true],
    ["Reset", ""]
  ],
  ["Layer", 
    ["Clear", "Shift + Ctrl + X"]
  ],
  ["Edit", 
    ["Undo", "Ctrl + Z"],
    ["Redo", "Shift + Ctrl + Z"]
  ],
  ["View", 
    ["Zoom Out", "Ctrl + Subtract"], 
    ["Zoom In", "Ctrl + Add"]
  ]
];

class Tool {
  constructor(name, logo, hotkey, disable=false) {
    this.name = name;
    this.logo = logo;
    this.hotkey = hotkey;
    this.disable = disable;
    this.flags = {};
  }
  setFlags(key, value) { 
    this.flags[key] = value;
    return this;
  }
}

export const tools = [
  (new Tool("Pen", "pen.svg", "P")),
  (new Tool("Eraser", "eraser.svg", "E")),
  (new Tool("Eyedropper", "picker.svg", "I"))
    .setFlags("Layer Only", true),
  (new Tool("Line", "line.svg", "L"))
    .setFlags("Perpendicular", false),
  (new Tool("Rectangle", "square.svg", "R"))
    .setFlags("Fill", true)
    .setFlags("Square", false),
  (new Tool("Ellipse", "circle.svg", "C"))
    .setFlags("Fill", true),
  (new Tool("Drag", "drag.svg", "G"))
];

function handleKeyDown(event) {
  if (
    event.target.isContentEditable || 
    event.target.matches('input:not([readonly]):not([type="checkbox"]):not([type="radio"])')
  ) return;

  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    event.preventDefault()
  }

  const key = [
    event.shiftKey && 'Shift',
    event.ctrlKey && 'Ctrl',
    event.altKey && 'Alt',
    event.code.replace("Key", "").replace("Numpad", "")
  ].filter(Boolean).join(' + ');

  let func = tools.find(obj => obj.hotkey == key);
  
  if (func) selectedTool.value = tools.indexOf(func);
  else {
    func = menuItems.flat().find(item => item.includes(key));
    if (func) runFunc.value = func[0];
  }
};

document.addEventListener('keydown', handleKeyDown);

class Color {
  constructor(h=0, s=0, v=0) {
    this.hsv = reactive({
      h: h,
      s: s,
      v: v
    })

    this._alpha = ref(255);
    
    this.rgb = computed({
      get: () => {
        return hsvToRgb(this.hsv);
      },
      set: (value) => {
        value = RgbToHsv(value);
        Object.assign(this.hsv, value);

        this.hueX.value = (value.h / 360) * this.hue.value.offsetWidth;
        this.squareX.value = value.s * this.square.value.offsetWidth;
        this.squareY.value = (1 - value.v) * this.square.value.offsetHeight;
      }
    })

    this._hex = computed({
      get: () => {
        return rgbaToHex({ ...this.rgb.value, a: this._alpha.value });
      },
      set: (value) => {
        value = hexToRgba(value);
        this.rgb.value = {
          r: value.r,
          g: value.g,
          b: value.b
        }

        this._alpha.value = value.a;
        this.alphaX.value = (value.a / 255) * this.alpha.value.offsetWidth;
      }
    })

    this.squareX = ref(0);
    this.squareY = ref(183.33);
    this.hueX = ref(0);
    this.alphaX = ref(275);


    this.hue = ref(null);
    this.square = ref(null);
    this.alpha = ref(null);
  }

  get cssCleanColor() {
    return `hsl(${this.hsv.h}deg 100% 50%)`;
  }
  get r() {
    return this.rgb.value.r;
  }
  get g() {
    return this.rgb.value.g;
  }
  get b() {
    return this.rgb.value.b;
  }
  get a() {
    return this._alpha.value;
  }
  get hex() {
    return this._hex.value.substring(7, 9) == "FF" 
      ? this._hex.value.slice(0, -2) 
      : this._hex.value;
  }
  set r(value) {
    this.changeRgb(value, "r");
  }
  set g(value) {
    this.changeRgb(value, "g");
  }
  set b(value) {
    this.changeRgb(value, "b");
  }
  set a(value) {
    this._alpha.value = value;
  }
  set hex(value) {
    this._hex.value = value;
  }
  changeRgb(value, letter) {
    this.rgb.value = {
      ...this.rgb.value, 
      [letter]: Math.min(255, parseInt(value) || 0)
    }
  }
}

function hsvToRgb(hsv) {
  const h = ((hsv.h % 360) + 360) % 360;

  const c = hsv.v * hsv.s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = hsv.v - c;

  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x
  } else if (h < 240) {
    r = 0; g = x; b = c
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

function RgbToHsv(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  let h = 0;
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);

  if (c) {
    if (v == r) {
      h = (g - b) / c
    } else if (v == g) {
      h = 2 + (b - r) / c
    } else {
      h = 4 + (r - g) / c
    }
  }
  if (h < 0) {
    h += 6
  }
  h *= 60

  return {
    h: h,
    s: v && c / v,
    v: v
  }
}

function colorToHex(value) {
  return Math.round(value).toString(16).padStart(2, "0");
}
function hexToColor(hex) {
  return parseInt(hex, 16)
}

export function rgbaToHex(rgba) {
  return (
    "#" +
    colorToHex(rgba.r) +
    colorToHex(rgba.g) +
    colorToHex(rgba.b) +
    colorToHex(rgba.a)
  ).toUpperCase();
}
export function hexToRgba(hex) {
  hex = hex.trim();
  hex = hex.replace('#', '');

  if (!/^[0-9A-Fa-f]+$/.test(hex)) hex = "ffffff";

  if (hex.length == 3 || hex.length == 4) {
    hex = hex.split("").map(e => e + e).join("");
  }

  let hexa;

  if (hex.length == 8) {
    hexa = hexToColor(hex.slice(-2));
    hex = hex.slice(0, -2);
  } else {
    hexa = 255;
  }

  if (hex.length == 6) {
    return {
      r: hexToColor(hex.substring(0, 2)),
      g: hexToColor(hex.substring(2, 4)),
      b: hexToColor(hex.substring(4, 6)),
      a: hexa
    }
  }
}

export const color = new Color();
