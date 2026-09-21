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

export const selectedTool = ref("Pen");

export const runFunc = ref(null);
export const runRender = ref(null);
export const runErrorMessage = ref(null);

export const windowBlock = ref(true);

export const menuItems = [
  ["File", 
    ["New", "Shift + N"], 
    ["Open", "Ctrl + O", true], 
    ["Save", "Ctrl + S", true],
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

export const tools = [
  ["Pen", "pen.svg", "P"],
  ["Eraser", "eraser.svg", "E"],
  ["Eyedropper", "picker.svg", "I"],
  ["Line", "line.svg", "L"],
  ["Drag", "drag.svg", "G"]
];

function handleKeyDown(event) {
  if (event.target.tagName === "INPUT") return;
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    event.preventDefault()
  }

  const key = [
    event.shiftKey && 'Shift',
    event.ctrlKey && 'Ctrl',
    event.altKey && 'Alt',
    event.code.replace("Key", "").replace("Numpad", "")
  ].filter(Boolean).join(' + ');

  console.log(key)

  let func = tools.find(item => item[2] == key)?.[0];
  
  if (func) selectedTool.value = func;
  else {
    func = menuItems.find(level1 => level1.some(level2 => level2.includes(key)))?.find(level2 => level2.includes(key));
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
    
    this.rgb = computed({
      get: () => {
        return hsvToRgb(this.hsv)
      },
      set: (value) => {
        value = RgbToHsv(value)
        Object.assign(this.hsv, value)

        this.hueX.value = (value.h / 360) * this.hue.value.offsetWidth
        this.squareX.value = value.s * this.square.value.offsetWidth
        this.squareY.value = (1 - value.v) * this.square.value.offsetHeight
      }
    })

    this._hex = computed({
      get: () => {
        return (
          "#" +
          this.rgb.value.r.toString(16).padStart(2, "0") +
          this.rgb.value.g.toString(16).padStart(2, "0") +
          this.rgb.value.b.toString(16).padStart(2, "0")
        ).toUpperCase();
      },
      set: (value) => {
        value = value.trim();
        value = value.replace('#', '');

        if (!/^[0-9A-Fa-f]+$/.test(value)) {value = "ffffff"}
        if (value.length == 3) { value = value.split("").map(e => e + e).join("") }

        if (value.length == 6) {
          this.rgb.value = {
            r: parseInt(value.substring(0, 2), 16),
            g: parseInt(value.substring(2, 4), 16),
            b: parseInt(value.substring(4, 6), 16)
          }
        }
      }
    })
    this.squareX = ref(0);
    this.squareY = ref(230);
    this.hueX = ref(0);

    this.hue = ref(null);
    this.square = ref(null);
  }

  get cssCleanColor() {
    return `hsl(${this.hsv.h}deg 100% 50%)`
  }
  get r() {
    return this.rgb.value.r 
  }
  get g() {
    return this.rgb.value.g 
  }
  get b() {
    return this.rgb.value.b
  }
  get hex() {
    return this._hex.value
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

export const color = new Color();
