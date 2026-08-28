function renderApp() {
  const app = document.getElementById('app');
  const savedTheme = localStorage.getItem('theme') || 'light';

  app.innerHTML = `
    <header class="header">
      <div class="container header__inner">
        <a href="./" class="header__logo">
          <img class="icon-img" src="./img/logo.png" alt="Formcut" />
          <div class="header__logo-text">
            <span class="header__brand">Formcut</span>
            <span class="header__tagline">ЧПУ різання • 3Д друк</span>
          </div>
        </a>
        <nav class="header__nav">
          <a href="#constructor" class="header__link header__link--active">Конструктор</a>
          <a href="#features" class="header__link">Можливості</a>
          <a href="#" class="header__link">Контакти</a>
        </nav>
        <div class="header__actions">
          <a href="tel:+380991234567" class="header__phone">+380 99 123 45 67</a>
          <button class="theme-toggle" id="theme-toggle" aria-label="Переключити тему">🌙</button>
          <button class="btn-primary">Замовити дзвінок</button>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="container">
        <div class="slider"></div>
        <div class="hero-stats">
          <div class="hero-stats__item">
            <div class="hero-stats__value">500+</div>
            <div class="hero-stats__label">Задоволених клієнтів</div>
          </div>
          <div class="hero-stats__item">
            <div class="hero-stats__value">24ч</div>
            <div class="hero-stats__label">Термін виготовлення</div>
          </div>
          <div class="hero-stats__item">
            <div class="hero-stats__value">0.1мм</div>
            <div class="hero-stats__label">Точність ЧПУ</div>
          </div>
          <div class="hero-stats__item">
            <div class="hero-stats__value">6+</div>
            <div class="hero-stats__label">Видів матеріалів</div>
          </div>
        </div>
      </div>
    </section>

    <section class="constructor" id="constructor">
      <div class="container">
        <div class="constructor__tabs">
          <button class="constructor__tab constructor__tab--cnc constructor__tab--active" data-tab="cnc">
            <span class="constructor__tab-icon">⚙️</span>
            ЧПУ різання
          </button>
          <button class="constructor__tab constructor__tab--print" data-tab="print">
            <span class="constructor__tab-icon">🖨️</span>
            3Д друк
          </button>
        </div>

        <div class="constructor__header">
          <h1 class="constructor__title">Конструктор деталей</h1>
          <p class="constructor__subtitle">Оберіть параметри та отримайте ціну миттєво</p>
        </div>

        <div class="constructor__grid">
          <div class="constructor__form">
            <div id="panel-cnc">
              <div class="constructor__section">
                <label class="constructor__label" for="cnc-shape">Форма деталі</label>
                <select class="constructor__select" id="cnc-shape"></select>
              </div>

              <div class="constructor__section">
                <label class="constructor__label">2D превью — тягніть за кути</label>
                <div class="editor-wrap" id="editor-wrap"></div>
              </div>

              <div class="constructor__section">
                <label class="constructor__label">Розміри (мм)</label>
                <div class="constructor__dimensions">
                  <div class="constructor__input-group">
                    <label for="cnc-width">Довжина</label>
                    <input type="number" id="cnc-width" min="10" max="3000" step="0.1" placeholder="100" />
                    <span class="constructor__unit">мм</span>
                  </div>
                  <div class="constructor__input-group">
                    <label for="cnc-height">Ширина</label>
                    <input type="number" id="cnc-height" min="10" max="1500" step="0.1" placeholder="100" />
                    <span class="constructor__unit">мм</span>
                  </div>
                  <div class="constructor__input-group">
                    <label for="cnc-thickness">Товщина мат.</label>
                    <input type="number" id="cnc-thickness" min="0.5" max="50" step="0.5" placeholder="3" />
                    <span class="constructor__unit">мм</span>
                  </div>
                </div>
              </div>

              <div class="constructor__section" id="wall-section" style="display:none;">
                <label class="constructor__label">Товщина стінки (мм)</label>
                <div class="constructor__dimensions">
                  <div class="constructor__input-group">
                    <label for="cnc-wall">Стінка</label>
                    <input type="number" id="cnc-wall" min="1" max="200" step="0.5" placeholder="5" />
                    <span class="constructor__unit">мм</span>
                  </div>
                </div>
              </div>

              <div class="constructor__section">
                <label class="constructor__label">Матеріал</label>
                <div class="constructor__materials" id="cnc-materials"></div>
              </div>

              <div class="constructor__section">
                <label class="constructor__label">Кількість</label>
                <div class="constructor__quantity">
                  <div class="constructor__qty-controls">
                    <button class="constructor__qty-btn cnc-qty-minus">−</button>
                    <div class="constructor__qty-value cnc-qty-value">1</div>
                    <button class="constructor__qty-btn cnc-qty-plus">+</button>
                  </div>
                  <span class="constructor__qty-label">штук</span>
                </div>
              </div>
            </div>

            <div id="panel-print" style="display: none;">
              <div class="constructor__section">
                <label class="constructor__label">Пластик для друку</label>
                <div class="constructor__materials print__materials" id="print-materials"></div>
              </div>

              <div class="constructor__section">
                <div class="constructor__weight-display">
                  <div class="constructor__weight-value" id="print-weight-display">50</div>
                  <div class="constructor__weight-unit">грамів</div>
                </div>
                <div class="constructor__slider-group">
                  <div class="constructor__slider-header">
                    <span class="constructor__slider-label">Орієнтовна вага моделі</span>
                    <span class="constructor__slider-value" id="print-weight-label">50 г</span>
                  </div>
                  <input type="range" id="print-weight" class="constructor__slider" min="5" max="2000" step="5" value="50" />
                </div>
              </div>

              <div class="constructor__section">
                <label class="constructor__label">Кількість</label>
                <div class="constructor__quantity">
                  <div class="constructor__qty-controls">
                    <button class="constructor__qty-btn print-qty-minus">−</button>
                    <div class="constructor__qty-value print-qty-value">1</div>
                    <button class="constructor__qty-btn print-qty-plus">+</button>
                  </div>
                  <span class="constructor__qty-label">штук</span>
                </div>
              </div>
            </div>
          </div>

          <div class="cart cart--cnc" id="cart-cnc">
            <h3 class="cart__title">
              🛒 Корзина ЧПУ
              <span class="cart__badge cart__badge--count" id="cnc-cart-count" style="display:none;">0</span>
            </h3>
            <div class="cart__empty" id="cnc-cart-empty">
              <div class="cart__empty-icon">⚙️</div>
              <div class="cart__empty-text">Додайте деталь до корзини</div>
            </div>
            <div class="cart__items" id="cnc-cart-items"></div>
            <div class="cart__preview" id="cnc-preview">
              <div class="cart__preview-shape">▬</div>
            </div>
            <div class="cart__summary" id="cnc-summary"></div>
            <div class="cart__total">
              <span class="cart__total-label">Разом:</span>
              <span class="cart__total-price" id="cnc-total">0 ₴</span>
            </div>
            <button class="cart__btn cart__btn--main" id="cnc-add-btn">Додати до корзини</button>
            <button class="cart__btn cart__btn--checkout" id="cnc-checkout-btn" style="display:none;">Оформити замовлення</button>
            <p class="cart__note">Орієнтовна ціна. Точна вартість після уточнення.</p>
          </div>

          <div class="cart cart--print" id="cart-print" style="display:none;">
            <h3 class="cart__title">
              🛒 Корзина 3Д друку
              <span class="cart__badge cart__badge--count" id="print-cart-count" style="display:none;">0</span>
            </h3>
            <div class="cart__empty" id="print-cart-empty">
              <div class="cart__empty-icon">🖨️</div>
              <div class="cart__empty-text">Додайте модель до корзини</div>
            </div>
            <div class="cart__items" id="print-cart-items"></div>
            <div class="cart__preview" id="print-preview">
              <div class="cart__preview-shape">🖨️</div>
            </div>
            <div class="cart__summary" id="print-summary"></div>
            <div class="cart__total">
              <span class="cart__total-label">Разом:</span>
              <span class="cart__total-price" id="print-total">0 ₴</span>
            </div>
            <button class="cart__btn cart__btn--main" id="print-add-btn">Додати до корзини</button>
            <button class="cart__btn cart__btn--checkout" id="print-checkout-btn" style="display:none;">Оформити замовлення</button>
            <p class="cart__note">Орієнтовна ціна. Точна вартість після уточнення.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="features" id="features">
      <div class="container">
        <h2 class="features__title">Чому обирають нас</h2>
        <div class="features__grid">
          <div class="features__card">
            <div class="features__icon">⚡</div>
            <h3 class="features__card-title">Швидке виготовлення</h3>
            <p class="features__card-desc">Стандартні замовлення — від 3 робочих днів. Термінові — від 24 годин.</p>
          </div>
          <div class="features__card">
            <div class="features__icon">🎯</div>
            <h3 class="features__card-title">ЧПУ точність</h3>
            <p class="features__card-desc">Механічне різання на ЧПУ станках з точністю до 0.1 мм. Пластик, ПВХ, карбон.</p>
          </div>
          <div class="features__card">
            <div class="features__icon">🖨️</div>
            <h3 class="features__card-title">3Д друк</h3>
            <p class="features__card-desc">FDM та SLA друк з PLA, ABS, нейлону, смоли. Від прототипу до серії.</p>
          </div>
          <div class="features__card">
            <div class="features__icon">📦</div>
            <h3 class="features__card-title">Доставка по Україні</h3>
            <p class="features__card-desc">Нова Пошта, Meest, самовивіз. Безкоштовна доставка від 5000 ₴.</p>
          </div>
          <div class="features__card">
            <div class="features__icon">💰</div>
            <h3 class="features__card-title">Чесні ціни</h3>
            <p class="features__card-desc">Прозорий розрахунок вартості. Без прихованих платежів та переплат.</p>
          </div>
          <div class="features__card">
            <div class="features__icon">🛡️</div>
            <h3 class="features__card-title">Гарантія якості</h3>
            <p class="features__card-desc">Контроль якості на кожному етапі. Повернення або переробка за наш рахунок.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="footer__logo">
              <img class="logo-img" src="./img/logo.png" alt="Formcut" />
            </div>
            <p class="footer__desc">Порізка ПВХ, пластику та карбону. 3Д друк деталей будь-якої складності.</p>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="GitHub">
                <svg width="16" height="16"><use href="icons.svg#github-icon"/></svg>
              </a>
              <a href="#" class="footer__social-link" aria-label="Discord">
                <svg width="16" height="16"><use href="icons.svg#discord-icon"/></svg>
              </a>
              <a href="#" class="footer__social-link" aria-label="X">
                <svg width="16" height="16"><use href="icons.svg#x-icon"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title">Послуги</h4>
            <div class="footer__links">
              <a href="#constructor" class="footer__link">Порізка ПВХ+</a>
              <a href="#constructor" class="footer__link">3Д друк (FDM)</a>
              <a href="#constructor" class="footer__link">3Д друк (SLA)</a>
              <a href="#" class="footer__link">Постобробка</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title">Матеріали</h4>
            <div class="footer__links">
              <a href="#" class="footer__link">ПВХ / Оргскло</a>
              <a href="#" class="footer__link">Поліпропілен</a>
              <a href="#" class="footer__link">Полікарбонат</a>
              <a href="#" class="footer__link">Карбон</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title">Контакти</h4>
            <div class="footer__links">
              <a href="tel:+380991234567" class="footer__link">+380 99 123 45 67</a>
              <a href="mailto:info@mechacut.ua" class="footer__link">info@mechacut.ua</a>
              <a href="#" class="footer__link">м. Київ, вул. Заводська 12</a>
              <a href="#" class="footer__link">Пн-Пт: 9:00 — 18:00</a>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© 2026 Formcut. Усі права захищені.</span>
          <span>Точна робота з будь-якими матеріалами</span>
        </div>
      </div>
    </footer>
  `;

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

export { renderApp, toggleTheme };
