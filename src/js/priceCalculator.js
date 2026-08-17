import { MATERIALS } from './data.js';

function calculatePrice(shape, width, height, thickness, materialId, quantity, wallThickness = 5) {
  const material = MATERIALS.find((m) => m.id === materialId);
  if (!material || !width || !height || !thickness || !quantity) return 0;

  const w = width / 1000;
  const h = height / 1000;
  const t = thickness / 1000;
  const wall = wallThickness / 1000;

  let volumeFactor = 1;

  switch (shape) {
    case 'circle': {
      const radius = Math.min(w, h) / 2;
      volumeFactor = Math.PI * radius * radius;
      break;
    }
    case 'rectangle-cutout': {
      const iw = Math.max(w - wall * 2, 0);
      const ih = Math.max(h - wall * 2, 0);
      volumeFactor = w * h - iw * ih;
      break;
    }
    case 'circle-cutout': {
      const outerR = Math.min(w, h) / 2;
      const innerR = Math.max(outerR - wall, 0);
      volumeFactor = Math.PI * outerR * outerR - Math.PI * innerR * innerR;
      break;
    }
    case 'frame-rect': {
      const iw = Math.max(w - wall * 2, 0);
      const ih = Math.max(h - wall * 2, 0);
      volumeFactor = w * h - iw * ih;
      break;
    }
    case 'frame-circle': {
      const outerR = Math.min(w, h) / 2;
      const innerR = Math.max(outerR - wall, 0);
      volumeFactor = Math.PI * outerR * outerR - Math.PI * innerR * innerR;
      break;
    }
    default:
      volumeFactor = w * h;
  }

  const volume = volumeFactor * t;
  const weight = volume * material.density;
  const materialCost = weight * material.pricePerKg;
  const baseCost = 50;
  const setupCost = 30;
  const totalPerUnit = materialCost + baseCost + setupCost / quantity;

  return Math.round(totalPerUnit * quantity * 100) / 100;
}

function calculatePrintPrice(materialId, weightGrams, quantity) {
  const material = PRINT_MATERIALS.find((m) => m.id === materialId);
  if (!material || !weightGrams || !quantity) return 0;

  const weightKg = weightGrams / 1000;
  const materialCost = weightKg * material.pricePerKg;
  const baseCost = 100;
  const supportCost = weightKg * 200;
  const totalPerUnit = materialCost + baseCost + supportCost;

  return Math.round(totalPerUnit * quantity * 100) / 100;
}

function formatPrice(price) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export { calculatePrice, calculatePrintPrice, formatPrice };
