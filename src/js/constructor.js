import { SHAPES, MATERIALS, PRINT_MATERIALS } from './data.js';
import { calculatePrice, calculatePrintPrice, formatPrice } from './priceCalculator.js';
import { initEditor, refresh } from './editor2d.js';

let activeTab = 'cnc';

// ==================== CNC ====================
const cncState = { shape: 'rectangle', width: 100, height: 100, thickness: 3, wallThickness: 5, material: 'pvc', quantity: 1 };
const cncCart = [];

const CNC_SHAPES_WITH_WALL = ['rectangle-cutout', 'circle-cutout', 'frame-rect', 'frame-circle'];

function hasWall() { return CNC_SHAPES_WITH_WALL.includes(cncState.shape); }

function updateCncPreview() {
  const el = document.getElementById('cnc-preview');
  if (!el) return;
  const shape = SHAPES.find((s) => s.id === cncState.shape);
  el.innerHTML = `<div class="cart__preview-shape">${shape ? shape.icon : '▬'}</div>`;
}

function updateCncSummary() {
  const price = calculatePrice(cncState.shape, cncState.width, cncState.height, cncState.thickness, cncState.material, cncState.quantity, cncState.wallThickness);
  const material = MATERIALS.find((m) => m.id === cncState.material);
  const shape = SHAPES.find((s) => s.id === cncState.shape);

  const summary = document.getElementById('cnc-summary');
  if (summary) {
    let rows = `
      <div class="cart__row"><span class="cart__row-label">Форма</span><span class="cart__row-value">${shape ? shape.name : '—'}</span></div>
      <div class="cart__row"><span class="cart__row-label">Зовн. розміри</span><span class="cart__row-value">${cncState.width} × ${cncState.height} мм</span></div>
    `;
    if (hasWall()) {
      rows += `<div class="cart__row"><span class="cart__row-label">Стінка</span><span class="cart__row-value">${cncState.wallThickness} мм</span></div>`;
    }
    rows += `
      <div class="cart__row"><span class="cart__row-label">Товщина</span><span class="cart__row-value">${cncState.thickness} мм</span></div>
      <div class="cart__row"><span class="cart__row-label">Матеріал</span><span class="cart__row-value">${material ? material.name : '—'}</span></div>
      <div class="cart__row"><span class="cart__row-label">Кількість</span><span class="cart__row-value">${cncState.quantity} шт.</span></div>
    `;
    summary.innerHTML = rows;
  }

  const totalEl = document.getElementById('cnc-total');
  if (totalEl) totalEl.textContent = formatPrice(price);

  const btn = document.getElementById('cnc-add-btn');
  if (btn) btn.innerHTML = `Додати до корзини — ${formatPrice(price)}`;
}

function renderCncCart() {
  const itemsEl = document.getElementById('cnc-cart-items');
  const emptyEl = document.getElementById('cnc-cart-empty');
  const checkoutBtn = document.getElementById('cnc-checkout-btn');
  const countEl = document.getElementById('cnc-cart-count');
  if (!itemsEl) return;

  if (cncCart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (countEl) countEl.style.display = 'none';
  } else {
    if (emptyEl) emptyEl.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'flex';
    if (countEl) { countEl.style.display = 'inline-flex'; countEl.textContent = cncCart.length; }
  }

  itemsEl.innerHTML = cncCart.map((item, i) => {
    const shape = SHAPES.find((s) => s.id === item.shape);
    const material = MATERIALS.find((m) => m.id === item.material);
    return `
      <div class="cart__item">
        <div class="cart__item-header">
          <span class="cart__item-icon">${shape ? shape.icon : '▬'}</span>
          <span class="cart__item-name">${shape ? shape.name : 'Деталь'} × ${item.quantity}</span>
          <button class="cart__item-remove" data-index="${i}">✕</button>
        </div>
        <div class="cart__item-details">
          <span>${item.width}×${item.height}×${item.thickness} мм</span>
          <span>${material ? material.name : ''}</span>
        </div>
        <div class="cart__item-price">${formatPrice(item.totalPrice)}</div>
      </div>
    `;
  }).join('');

  const total = cncCart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalEl = document.getElementById('cnc-total');
  if (totalEl) totalEl.textContent = formatPrice(total);

  itemsEl.querySelectorAll('.cart__item-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      cncCart.splice(parseInt(e.target.dataset.index), 1);
      renderCncCart();
    });
  });
}

function syncCncInputs() {
  const w = document.getElementById('cnc-width');
  const h = document.getElementById('cnc-height');
  if (w) w.value = cncState.width;
  if (h) h.value = cncState.height;
}

// ==================== 3D PRINT ====================
const printState = { material: 'pla', weight: 50, quantity: 1 };
const printCart = [];

function updatePrintSummary() {
  const price = calculatePrintPrice(printState.material, printState.weight, printState.quantity);
  const material = PRINT_MATERIALS.find((m) => m.id === printState.material);

  const summary = document.getElementById('print-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="cart__row"><span class="cart__row-label">Технологія</span><span class="cart__row-value">3Д друк (FDM/SLA)</span></div>
      <div class="cart__row"><span class="cart__row-label">Пластик</span><span class="cart__row-value">${material ? material.name : '—'}</span></div>
      <div class="cart__row"><span class="cart__row-label">Вага</span><span class="cart__row-value">${printState.weight} г</span></div>
      <div class="cart__row"><span class="cart__row-label">Кількість</span><span class="cart__row-value">${printState.quantity} шт.</span></div>
    `;
  }

  const totalEl = document.getElementById('print-total');
  if (totalEl) totalEl.textContent = formatPrice(price);

  const btn = document.getElementById('print-add-btn');
  if (btn) btn.innerHTML = `Додати до корзини — ${formatPrice(price)}`;
}

function renderPrintCart() {
  const itemsEl = document.getElementById('print-cart-items');
  const emptyEl = document.getElementById('print-cart-empty');
  const checkoutBtn = document.getElementById('print-checkout-btn');
  const countEl = document.getElementById('print-cart-count');
  if (!itemsEl) return;

  if (printCart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (countEl) countEl.style.display = 'none';
  } else {
    if (emptyEl) emptyEl.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'flex';
    if (countEl) { countEl.style.display = 'inline-flex'; countEl.textContent = printCart.length; }
  }

  itemsEl.innerHTML = printCart.map((item, i) => {
    const material = PRINT_MATERIALS.find((m) => m.id === item.material);
    return `
      <div class="cart__item">
        <div class="cart__item-header">
          <span class="cart__item-icon">🖨️</span>
          <span class="cart__item-name">${material ? material.name : 'Модель'} × ${item.quantity}</span>
          <button class="cart__item-remove" data-index="${i}">✕</button>
        </div>
        <div class="cart__item-details"><span>${item.weight} г</span></div>
        <div class="cart__item-price">${formatPrice(item.totalPrice)}</div>
      </div>
    `;
  }).join('');

  const total = printCart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalEl = document.getElementById('print-total');
  if (totalEl) totalEl.textContent = formatPrice(total);

  itemsEl.querySelectorAll('.cart__item-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      printCart.splice(parseInt(e.target.dataset.index), 1);
      renderPrintCart();
    });
  });
}

// ==================== INIT ====================
function toggleWallSection() {
  const wallSection = document.getElementById('wall-section');
  if (wallSection) wallSection.style.display = hasWall() ? 'block' : 'none';
}

function initTabs() {
  const tabs = document.querySelectorAll('.constructor__tab');
  const cncPanel = document.getElementById('panel-cnc');
  const printPanel = document.getElementById('panel-print');
  const cncCartEl = document.getElementById('cart-cnc');
  const printCartEl = document.getElementById('cart-print');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove('constructor__tab--active'));
      tab.classList.add('constructor__tab--active');

      if (activeTab === 'cnc') {
        if (cncPanel) cncPanel.style.display = 'block';
        if (printPanel) printPanel.style.display = 'none';
        if (cncCartEl) cncCartEl.style.display = 'block';
        if (printCartEl) printCartEl.style.display = 'none';
      } else {
        if (cncPanel) cncPanel.style.display = 'none';
        if (printPanel) printPanel.style.display = 'block';
        if (cncCartEl) cncCartEl.style.display = 'none';
        if (printCartEl) printCartEl.style.display = 'block';
      }
    });
  });
}

function initCnc() {
  // Shape select
  const selectEl = document.getElementById('cnc-shape');
  if (selectEl) {
    selectEl.innerHTML = SHAPES.map((s) =>
      `<option value="${s.id}"${s.id === cncState.shape ? ' selected' : ''}>${s.name}</option>`
    ).join('');
    selectEl.addEventListener('change', (e) => {
      cncState.shape = e.target.value;
      toggleWallSection();
      updateCncPreview();
      updateCncSummary();
      refresh();
    });
  }

  // 2D Editor
  const editorWrap = document.getElementById('editor-wrap');
  if (editorWrap) {
    initEditor(
      editorWrap,
      () => ({ shape: cncState.shape, width: cncState.width, height: cncState.height, thickness: cncState.thickness, wallThickness: cncState.wallThickness }),
      (dims) => {
        cncState.width = dims.width;
        cncState.height = dims.height;
        syncCncInputs();
        updateCncSummary();
        refresh();
      }
    );
  }

  // Dimensions
  const w = document.getElementById('cnc-width');
  const h = document.getElementById('cnc-height');
  const t = document.getElementById('cnc-thickness');
  const wall = document.getElementById('cnc-wall');

  if (w) { w.value = cncState.width; w.addEventListener('input', (e) => { cncState.width = parseFloat(e.target.value) || 0; updateCncSummary(); refresh(); }); }
  if (h) { h.value = cncState.height; h.addEventListener('input', (e) => { cncState.height = parseFloat(e.target.value) || 0; updateCncSummary(); refresh(); }); }
  if (t) { t.value = cncState.thickness; t.addEventListener('input', (e) => { cncState.thickness = parseFloat(e.target.value) || 0; updateCncSummary(); }); }
  if (wall) {
    wall.value = cncState.wallThickness;
    wall.addEventListener('input', (e) => { cncState.wallThickness = parseFloat(e.target.value) || 1; updateCncSummary(); refresh(); });
  }

  toggleWallSection();

  // Materials
  const matsEl = document.getElementById('cnc-materials');
  if (matsEl) {
    matsEl.innerHTML = MATERIALS.map((m) => `
      <div class="constructor__material${m.id === cncState.material ? ' constructor__material--active' : ''}" data-material="${m.id}">
        <div class="constructor__material-color" style="background:${m.color}"></div>
        <div class="constructor__material-info">
          <div class="constructor__material-name">${m.name}</div>
          <div class="constructor__material-price">від ${m.pricePerKg} ₴/кг · ${m.desc}</div>
        </div>
        <div class="constructor__material-check"></div>
      </div>
    `).join('');

    matsEl.addEventListener('click', (e) => {
      const el = e.target.closest('.constructor__material');
      if (!el) return;
      cncState.material = el.dataset.material;
      matsEl.querySelectorAll('.constructor__material').forEach((m) => m.classList.toggle('constructor__material--active', m.dataset.material === cncState.material));
      updateCncSummary();
    });
  }

  // Quantity
  const qtyVal = document.querySelector('.cnc-qty-value');
  document.querySelector('.cnc-qty-minus')?.addEventListener('click', () => {
    if (cncState.quantity > 1) { cncState.quantity--; if (qtyVal) qtyVal.textContent = cncState.quantity; updateCncSummary(); }
  });
  document.querySelector('.cnc-qty-plus')?.addEventListener('click', () => {
    if (cncState.quantity < 10000) { cncState.quantity++; if (qtyVal) qtyVal.textContent = cncState.quantity; updateCncSummary(); }
  });

  // Add to cart
  document.getElementById('cnc-add-btn')?.addEventListener('click', () => {
    const price = calculatePrice(cncState.shape, cncState.width, cncState.height, cncState.thickness, cncState.material, cncState.quantity, cncState.wallThickness);
    cncCart.push({ ...cncState, totalPrice: price });
    renderCncCart();
  });

  updateCncPreview();
  updateCncSummary();
  renderCncCart();
}

function initPrint() {
  const matsEl = document.getElementById('print-materials');
  if (matsEl) {
    matsEl.innerHTML = PRINT_MATERIALS.map((m) => `
      <div class="constructor__material${m.id === printState.material ? ' constructor__material--active' : ''}" data-material="${m.id}">
        <div class="constructor__material-color" style="background:${m.color}"></div>
        <div class="constructor__material-info">
          <div class="constructor__material-name">${m.name}</div>
          <div class="constructor__material-price">${m.pricePerKg} ₴/кг · ${m.desc}</div>
        </div>
        <div class="constructor__material-check"></div>
      </div>
    `).join('');

    matsEl.addEventListener('click', (e) => {
      const el = e.target.closest('.constructor__material');
      if (!el) return;
      printState.material = el.dataset.material;
      matsEl.querySelectorAll('.constructor__material').forEach((m) => m.classList.toggle('constructor__material--active', m.dataset.material === printState.material));
      updatePrintSummary();
    });
  }

  const slider = document.getElementById('print-weight');
  const display = document.getElementById('print-weight-display');
  const label = document.getElementById('print-weight-label');
  if (slider) {
    slider.value = printState.weight;
    slider.addEventListener('input', (e) => {
      printState.weight = parseInt(e.target.value) || 0;
      if (display) display.textContent = printState.weight;
      if (label) label.textContent = printState.weight + ' г';
      updatePrintSummary();
    });
  }

  const qtyVal = document.querySelector('.print-qty-value');
  document.querySelector('.print-qty-minus')?.addEventListener('click', () => {
    if (printState.quantity > 1) { printState.quantity--; if (qtyVal) qtyVal.textContent = printState.quantity; updatePrintSummary(); }
  });
  document.querySelector('.print-qty-plus')?.addEventListener('click', () => {
    if (printState.quantity < 10000) { printState.quantity++; if (qtyVal) qtyVal.textContent = printState.quantity; updatePrintSummary(); }
  });

  document.getElementById('print-add-btn')?.addEventListener('click', () => {
    const price = calculatePrintPrice(printState.material, printState.weight, printState.quantity);
    printCart.push({ ...printState, totalPrice: price });
    renderPrintCart();
  });

  updatePrintSummary();
}

function initConstructor() {
  initTabs();
  initCnc();
  initPrint();
}

export { initConstructor };
