const slides = [
  {
    tag: 'ЧПУ різання',
    title: 'Механічне різання пластику',
    desc: 'Точне ЧПУ різання деталей з ПВХ, пластику та карбону на сучасних станках.',
    image: '⚙️',
  },
  {
    tag: '3Д друк',
    title: 'FDM та SLA друк',
    desc: '3Д дruk деталей з PLA, ABS, нейлону та смоли. Якісний друк за доступними цінами.',
    image: '🖨️',
  },
  {
    tag: 'Конструктор',
    title: 'Розрахуйте ціну онлайн',
    desc: 'Оберіть форму, розміри та матеріал — отримайте ціну миттєво. Без реєстрації.',
    image: '📐',
  },
];

let currentSlide = 0;
let autoPlayTimer = null;

function renderSlider() {
  const sliderEl = document.querySelector('.slider');
  if (!sliderEl) return;

  sliderEl.innerHTML = `
    <div class="slider__track">
      ${slides.map((s) => `
        <div class="slider__slide">
          <div class="slider__content">
            <span class="slider__tag">${s.tag}</span>
            <h2 class="slider__title">${s.title}</h2>
            <p class="slider__desc">${s.desc}</p>
            <a href="#cnc" class="btn-primary">Спробувати зараз</a>
          </div>
          <div class="slider__image">${s.image}</div>
        </div>
      `).join('')}
    </div>
    <button class="slider__arrow slider__arrow--prev" aria-label="Попередній">‹</button>
    <button class="slider__arrow slider__arrow--next" aria-label="Наступний">›</button>
    <div class="slider__dots">
      ${slides.map((_, i) =>
        `<div class="slider__dot${i === 0 ? ' slider__dot--active' : ''}" data-index="${i}"></div>`
      ).join('')}
    </div>
  `;

  const track = sliderEl.querySelector('.slider__track');
  const dots = sliderEl.querySelectorAll('.slider__dot');
  const prevBtn = sliderEl.querySelector('.slider__arrow--prev');
  const nextBtn = sliderEl.querySelector('.slider__arrow--next');

  function goTo(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('slider__dot--active', i === currentSlide));
  }

  prevBtn.addEventListener('click', () => { goTo(currentSlide - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goTo(currentSlide + 1); resetAutoPlay(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); resetAutoPlay(); });
  });

  function startAutoPlay() { autoPlayTimer = setInterval(() => goTo(currentSlide + 1), 5000); }
  function resetAutoPlay() { clearInterval(autoPlayTimer); startAutoPlay(); }
  startAutoPlay();
}

export { renderSlider };
