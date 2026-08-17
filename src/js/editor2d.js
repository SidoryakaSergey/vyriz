const SVG_NS = 'http://www.w3.org/2000/svg';

const VIEWBOX_W = 440;
const VIEWBOX_H = 300;
const PADDING = 45;

let svgEl = null;
let state = null;
let onUpdate = null;
let drag = null;

function setSvgAttribute(el, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
}

function createSvgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  setSvgAttribute(el, attrs);
  return el;
}

function shapeToPath(shape, w, h, wall) {
  const cx = VIEWBOX_W / 2;
  const cy = VIEWBOX_H / 2;
  const hw = w / 2;
  const hh = h / 2;

  switch (shape) {
    case 'rectangle':
      return `M${cx - hw},${cy - hh} L${cx + hw},${cy - hh} L${cx + hw},${cy + hh} L${cx - hw},${cy + hh} Z`;

    case 'circle': {
      const r = Math.min(hw, hh);
      return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
    }

    case 'rectangle-cutout': {
      const iw = Math.max(w - wall * 2, 2);
      const ih = Math.max(h - wall * 2, 2);
      const ihw = iw / 2;
      const ihh = ih / 2;
      return `M${cx - hw},${cy - hh} L${cx + hw},${cy - hh} L${cx + hw},${cy + hh} L${cx - hw},${cy + hh} Z` +
        ` M${cx - ihw},${cy - ihh} L${cx + ihw},${cy - ihh} L${cx + ihw},${cy + ihh} L${cx - ihw},${cy + ihh} Z`;
    }

    case 'circle-cutout': {
      const outerR = Math.min(hw, hh);
      const innerR = Math.max(outerR - wall, 1);
      return `M${cx - outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx + outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx - outerR},${cy} Z` +
        ` M${cx - innerR},${cy} A${innerR},${innerR} 0 1,1 ${cx + innerR},${cy} A${innerR},${innerR} 0 1,1 ${cx - innerR},${cy} Z`;
    }

    case 'frame-rect': {
      const iw = Math.max(w - wall * 2, 2);
      const ih = Math.max(h - wall * 2, 2);
      const ihw = iw / 2;
      const ihh = ih / 2;
      return `M${cx - hw},${cy - hh} L${cx + hw},${cy - hh} L${cx + hw},${cy + hh} L${cx - hw},${cy + hh} Z` +
        ` M${cx - ihw},${cy - ihh} L${cx + ihw},${cy - ihh} L${cx + ihw},${cy + ihh} L${cx - ihw},${cy + ihh} Z`;
    }

    case 'frame-circle': {
      const outerR = Math.min(hw, hh);
      const innerR = Math.max(outerR - wall, 1);
      return `M${cx - outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx + outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx - outerR},${cy} Z` +
        ` M${cx - innerR},${cy} A${innerR},${innerR} 0 1,1 ${cx + innerR},${cy} A${innerR},${innerR} 0 1,1 ${cx - innerR},${cy} Z`;
    }

    default:
      return `M${cx - hw},${cy - hh} L${cx + hw},${cy - hh} L${cx + hw},${cy + hh} L${cx - hw},${cy + hh} Z`;
  }
}

function getScale(w, h) {
  const availW = VIEWBOX_W - PADDING * 2;
  const availH = VIEWBOX_H - PADDING * 2;
  return Math.min(availW / Math.max(w, 1), availH / Math.max(h, 1));
}

function render() {
  if (!svgEl || !state) return;

  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  const { shape, width, height, wallThickness } = state();
  if (!width || !height) return;

  const scale = getScale(width, height);
  const drawW = width * scale;
  const drawH = height * scale;

  const defs = createSvgEl('defs');
  const pattern = createSvgEl('pattern', { id: 'grid', width: 20, height: 20, patternUnits: 'userSpaceOnUse' });
  pattern.appendChild(createSvgEl('path', {
    d: 'M 20 0 L 0 0 0 20',
    fill: 'none',
    stroke: 'rgba(128,128,128,0.08)',
    'stroke-width': '0.5'
  }));
  defs.appendChild(pattern);
  svgEl.appendChild(defs);

  svgEl.appendChild(createSvgEl('rect', {
    x: 0, y: 0, width: VIEWBOX_W, height: VIEWBOX_H,
    fill: 'url(#grid)'
  }));

  const wall = (shape === 'rectangle-cutout' || shape === 'circle-cutout' ||
    shape === 'frame-rect' || shape === 'frame-circle') ? wallThickness : 0;
  const scaledWall = wall * scale;

  const shapePath = createSvgEl('path', {
    d: shapeToPath(shape, drawW, drawH, scaledWall),
    fill: 'var(--cnc-accent-light, rgba(224,122,58,0.08))',
    stroke: 'var(--cnc-accent, #e07a3a)',
    'stroke-width': '2',
    'fill-rule': 'evenodd'
  });
  svgEl.appendChild(shapePath);

  const cx = VIEWBOX_W / 2;
  const cy = VIEWBOX_H / 2;
  const hw = drawW / 2;
  const hh = drawH / 2;

  // Dimension lines
  const dimColor = '#94a3b8';
  const dimOffset = 14;

  // Width dimension (bottom)
  svgEl.appendChild(createSvgEl('line', {
    x1: cx - hw, y1: cy + hh + dimOffset,
    x2: cx + hw, y2: cy + hh + dimOffset,
    stroke: dimColor, 'stroke-width': '1'
  }));
  svgEl.appendChild(createSvgEl('line', {
    x1: cx - hw, y1: cy + hh + 4,
    x2: cx - hw, y2: cy + hh + dimOffset + 4,
    stroke: dimColor, 'stroke-width': '1'
  }));
  svgEl.appendChild(createSvgEl('line', {
    x1: cx + hw, y1: cy + hh + 4,
    x2: cx + hw, y2: cy + hh + dimOffset + 4,
    stroke: dimColor, 'stroke-width': '1'
  }));
  const widthLabel = createSvgEl('text', {
    x: cx, y: cy + hh + dimOffset + 14,
    'text-anchor': 'middle', fill: dimColor,
    'font-size': '11', 'font-weight': '600',
    'font-family': 'Inter, sans-serif'
  });
  widthLabel.textContent = width + ' мм';
  svgEl.appendChild(widthLabel);

  // Height dimension (right)
  svgEl.appendChild(createSvgEl('line', {
    x1: cx + hw + dimOffset, y1: cy - hh,
    x2: cx + hw + dimOffset, y2: cy + hh,
    stroke: dimColor, 'stroke-width': '1'
  }));
  svgEl.appendChild(createSvgEl('line', {
    x1: cx + hw + 4, y1: cy - hh,
    x2: cx + hw + dimOffset + 4, y2: cy - hh,
    stroke: dimColor, 'stroke-width': '1'
  }));
  svgEl.appendChild(createSvgEl('line', {
    x1: cx + hw + 4, y1: cy + hh,
    x2: cx + hw + dimOffset + 4, y2: cy + hh,
    stroke: dimColor, 'stroke-width': '1'
  }));
  const heightLabel = createSvgEl('text', {
    x: cx + hw + dimOffset + 14, y: cy + 4,
    'text-anchor': 'middle', fill: dimColor,
    'font-size': '11', 'font-weight': '600',
    'font-family': 'Inter, sans-serif',
    transform: `rotate(90, ${cx + hw + dimOffset + 14}, ${cy})`
  });
  heightLabel.textContent = height + ' мм';
  svgEl.appendChild(heightLabel);

  // Control handles
  const handles = [
    { id: 'tl', x: cx - hw, y: cy - hh, cursor: 'nw-resize', axis: 'xy', dir: -1 },
    { id: 'tr', x: cx + hw, y: cy - hh, cursor: 'ne-resize', axis: 'xy', dir: 1 },
    { id: 'bl', x: cx - hw, y: cy + hh, cursor: 'sw-resize', axis: 'xy', dir: -1 },
    { id: 'br', x: cx + hw, y: cy + hh, cursor: 'se-resize', axis: 'xy', dir: 1 },
    { id: 'tm', x: cx, y: cy - hh, cursor: 'n-resize', axis: 'y', dir: -1 },
    { id: 'bm', x: cx, y: cy + hh, cursor: 's-resize', axis: 'y', dir: 1 },
    { id: 'ml', x: cx - hw, y: cy, cursor: 'w-resize', axis: 'x', dir: -1 },
    { id: 'mr', x: cx + hw, y: cy, cursor: 'e-resize', axis: 'x', dir: 1 },
  ];

  handles.forEach((h) => {
    const g = createSvgEl('g', { class: 'editor-handle', 'data-handle': h.id });
    g.style.cursor = h.cursor;

    g.appendChild(createSvgEl('circle', {
      cx: h.x, cy: h.y, r: 5,
      fill: 'white',
      stroke: 'var(--cnc-accent, #e07a3a)',
      'stroke-width': '2'
    }));

    g.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const svgRect = svgEl.getBoundingClientRect();
      drag = {
        handle: h,
        startMouse: { x: e.clientX, y: e.clientY },
        startDim: { w: width, h: height },
        svgScale: VIEWBOX_W / svgRect.width,
      };
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
    });

    svgEl.appendChild(g);
  });

  // Outline rectangle
  svgEl.appendChild(createSvgEl('rect', {
    x: cx - hw, y: cy - hh,
    width: drawW, height: drawH,
    fill: 'none',
    stroke: 'rgba(128,128,128,0.15)',
    'stroke-width': '1',
    'stroke-dasharray': '4,3'
  }));
}

function onDragMove(e) {
  if (!drag) return;
  const dx = (e.clientX - drag.startMouse.x) * drag.svgScale;
  const dy = (e.clientY - drag.startMouse.y) * drag.svgScale;
  const { axis, dir } = drag.handle;

  let newW = drag.startDim.w;
  let newH = drag.startDim.h;

  if (axis.includes('x')) {
    newW = Math.max(10, Math.min(3000, drag.startDim.w + dx * dir * 2));
  }
  if (axis.includes('y')) {
    newH = Math.max(10, Math.min(1500, drag.startDim.h + dy * dir * 2));
  }

  if (onUpdate) onUpdate({ width: Math.round(newW * 10) / 10, height: Math.round(newH * 10) / 10 });
}

function onDragEnd() {
  drag = null;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

function initEditor(containerEl, getStateFn, onUpdateFn) {
  svgEl = createSvgEl('svg', {
    viewBox: `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`,
    class: 'editor-canvas'
  });

  svgEl.style.width = '100%';
  svgEl.style.height = '100%';
  svgEl.style.display = 'block';

  containerEl.appendChild(svgEl);
  state = getStateFn;
  onUpdate = onUpdateFn;
  render();
}

function refresh() {
  render();
}

export { initEditor, refresh };
