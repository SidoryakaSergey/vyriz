import './main.scss';
import { renderApp } from './js/template.js';
import { renderSlider } from './js/slider.js';
import { initConstructor } from './js/constructor.js';

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  renderSlider();
  initConstructor();
});
