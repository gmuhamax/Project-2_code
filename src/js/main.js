import { loadCard } from './tool.js';

const apiKey = 'Wrom1SFhmivsqr0qBMcV6NJoa0MTYBhn';
const cont = document.querySelector('.container');
const modal = document.querySelector('.modal');
const wrapper_modal = document.querySelector('.wrapper__modal');
const pages = document.querySelector('.footer__numbers');
const header_wrapper = document.querySelector('.header__wrapper');
const country = document.querySelector('span.header__input');
const country_wrapper = document.querySelector('.header__input-wrapper');

const close_modal = () => {
  wrapper_modal.style.display = 'none';
  modal.style.display = 'none';
  document.body.style.overflowY = 'scroll';
};

let request = '';

loadCard('0', request, '');

cont.addEventListener('click', async e => {
  if (e.target.className.includes('main__card')) {
    let link = '';
    if (e.target.dataset.id) {
      link = `https://app.ticketmaster.com/discovery/v2/events/${e.target.dataset.id}?apikey=${apiKey}`;
    } else {
      link = `https://app.ticketmaster.com/discovery/v2/events/${e.target.parentElement.dataset.id}?apikey=${apiKey}`;
    }

    let response = await fetch(link);
    response = await response.json();

    response.priceRanges = response.priceRanges ? response.priceRanges : [{ min: 0, max: 0, currency: '$' }];

    modal.innerHTML = `
        <img class="modal__close" src="/Project-2/close.6a3fa3b0.png">
        <img src="${response.images[0].url}" alt="" class="modal__icon">
        <div class="modal__content">
          <img src="${response.images[0].url}" class="modal__preview"></img>
          <div class="modal__texts">
            <h2 class="modal__title">INFO</h2>
            <p class="modal__text">${response.info}</p>
            <h2 class="modal__title">WHEN</h2>
            <p class="modal__text">${response.dates.start.localDate} <br> ${response.dates.start.localTime} (${response.dates.timezone})</p>
            <h2 class="modal__title">WHERE</h2>
            <p class="modal__text">${response._embedded.venues[0].name}</p>
            <h2 class="modal__title">PRICES</h2>
            <p class="modal__text">Standart ${response.priceRanges[0].min}-${response.priceRanges[0].max} ${response.priceRanges[0].currency}</p>
            <a href="${response.url}" class="modal__btn">BUY TICKETS</a>
          </div>
        </div>
        <a class="modal__author" href="${response.url}">MORE FROM THIS AUTHOR</a>
        `;

    document.querySelector('.modal__close').addEventListener('click', close_modal);

    wrapper_modal.style.display = 'flex';
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
  }
});

wrapper_modal.addEventListener('click', e => {
  if (e.currentTarget == e.target) {
    close_modal();
  }
});

pages.addEventListener('click', e => {
  if (e.target.className == 'footer__numbers-number' && e.target.textContent != '...') {
    loadCard(Number(e.target.textContent) - 1, request, country.dataset.value);
  }
});

header_wrapper.search.addEventListener(
  'input',
  _.debounce(e => {
    request = e.target.value;
    loadCard('0', e.target.value, country.dataset.value);
  }, 500)
);

country.addEventListener('input', e => {
  loadCard('0', request, country.dataset.value);
});

country.addEventListener('click', () => {
  country.classList.toggle('active');
  country_wrapper.classList.toggle('active');
});

country_wrapper.addEventListener('click', e => {
  if (e.target.className == 'header__input-item') {
    country.innerHTML = e.target.innerHTML;
    country.dataset.value = e.target.dataset.value;
    country.classList.toggle('active');
    country_wrapper.classList.toggle('active');
    loadCard('0', request, country.dataset.value);
  }
});

const loader = document.querySelector('.loader');
document.body.style.overflow = 'hidden';
loader.addEventListener('click', () => {
  loader.classList.add('active');
  setTimeout(() => {
    loader.style.display = 'none';
    document.body.style.overflow = 'scroll';
    loader.remove();
  }, 2900);
});
