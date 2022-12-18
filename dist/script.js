"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const catalog = document.querySelector('.catalog');
const info = document.querySelector('.catalog__info');
const buttonDiv = document.querySelector('.button');
const loadMore = document.querySelector('.btn');
const dotDiv = document.querySelector('.loadingDots');
const searchInput = document.querySelector('.search');
const loadedCards = document.getElementsByClassName('card');
let page = 1;
const cardsCount = 4;
// Show / hide loading dots and button
const showHide = function (...elements) {
    elements.forEach((element) => element.classList.toggle('hidden'));
};
const getInitialCards = function (card, pag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            showHide(dotDiv, loadMore);
            const res = yield fetch(`https://api.pokemontcg.io/v2/cards?page=${pag}&pageSize=${card}`);
            const { data } = yield res.json();
            console.log(data);
            data.forEach((el) => {
                const html = `
      <article class="card" data-name="${el.name}">
          <div class="card__top-info">
            <h2>${el.name}</h2>
            <span>Nr: ${el.nationalPokedexNumbers[0]}</span>
          </div>
          <div class="card__image">
              <img
                class="image"
                src=${el.images.small}
                alt=${el.name}
            />
          </div>
          <div class="card__bottom-info">
            <p><span>Supertype:</span> ${el.supertype}</p>
            <p><span>Subtype:</span> ${el.subtypes[0]}</p>
            <p class="${el.rarity ? '' : 'hidden'}"><span>Rarity:</span> ${el.rarity}</p>
          </div>
        </article>
      `;
                catalog.insertAdjacentHTML('beforeend', html);
            });
            showHide(dotDiv, loadMore);
        }
        catch (err) {
            console.log(err);
        }
    });
};
getInitialCards(cardsCount, page);
// Load more button
loadMore.addEventListener('click', function () {
    page++;
    getInitialCards(cardsCount, page);
    searchInput.value = '';
    info.classList.add('hidden');
});
// Search input
searchInput.addEventListener('keyup', function (e) {
    const target = e.target;
    const searchValue = target.value.toLowerCase();
    // Array.from(loadedCards).forEach((el) => el.classList.add("hidden"));
    Array.from(loadedCards).filter((el) => {
        const name = el.dataset.name.toLowerCase();
        name.includes(searchValue)
            ? el.classList.remove('hidden')
            : el.classList.add('hidden');
    });
    Array.from(loadedCards).every((el) => el.classList.contains('hidden'))
        ? info.classList.remove('hidden')
        : info.classList.add('hidden');
    // Hidden Load More button
    Array.from(loadedCards).some((el) => el.classList.contains('hidden'))
        ? buttonDiv.classList.add('hidden')
        : buttonDiv.classList.remove('hidden');
    if (!info.classList.contains('hidden'))
        buttonDiv.classList.remove('hidden');
});
