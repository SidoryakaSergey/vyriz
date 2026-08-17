const SHAPES = [
  { id: 'rectangle', name: 'Прямокутник', icon: '▬' },
  { id: 'circle', name: 'Коло', icon: '●' },
  { id: 'rectangle-cutout', name: 'Прямокутник з вирізом', icon: '▢' },
  { id: 'circle-cutout', name: 'Коло з вирізом', icon: '◎' },
  { id: 'frame-rect', name: 'Рамка прямокутна', icon: '☐' },
  { id: 'frame-circle', name: 'Рамка кругла', icon: '⊙' },
];

const MATERIALS = [
  { id: 'pvc', name: 'ПВХ', pricePerKg: 45, density: 1.40, color: '#a78bfa', desc: 'Стійкий до вологи' },
  { id: 'pmma', name: 'Оргскло (ПММА)', pricePerKg: 85, density: 1.18, color: '#60a5fa', desc: 'Прозорий пластик' },
  { id: 'polypropylene', name: 'Поліпропілен', pricePerKg: 35, density: 0.91, color: '#34d399', desc: 'Гнучкий та легкий' },
  { id: 'polycarbonate', name: 'Полікарбонат', pricePerKg: 95, density: 1.20, color: '#fbbf24', desc: 'Ударостійкий' },
  { id: 'abs', name: 'ABS пластик', pricePerKg: 55, density: 1.04, color: '#f87171', desc: 'Універсальний' },
  { id: 'carbon', name: 'Карбон', pricePerKg: 320, density: 1.55, color: '#374151', desc: 'Міцний композит' },
];

const PRINT_MATERIALS = [
  { id: 'pla', name: 'PLA', pricePerKg: 600, color: '#34d399', desc: 'Біорозкладний, простий' },
  { id: 'abs-print', name: 'ABS', pricePerKg: 700, color: '#f87171', desc: 'Міцний, термостійкий' },
  { id: 'petg', name: 'PETG', pricePerKg: 750, color: '#60a5fa', desc: 'Гнучкий, стійкий' },
  { id: 'nylon', name: 'Нейлон (PA)', pricePerKg: 1200, color: '#fbbf24', desc: 'Зносостійкий' },
  { id: 'tpu', name: 'TPU', pricePerKg: 1500, color: '#a78bfa', desc: 'Еластичний (силікон)' },
  { id: 'resin', name: 'Смола (SLA)', pricePerKg: 2000, color: '#e879f9', desc: 'Висока деталізація' },
];

export { SHAPES, MATERIALS, PRINT_MATERIALS };
