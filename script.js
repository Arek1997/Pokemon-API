const catalog = document.querySelector(".catalog");
const info = document.querySelector(".catalog__info");
const buttonDiv = document.querySelector(".button");
const loadMore = document.querySelector(".btn");
const dots = document.querySelectorAll(".loadingDots");
const searchInput = document.querySelector(".search");
const loadedCards = document.getElementsByClassName("card");

let page = 1;
const cardsCount = 4;

const getInitialCards = async function (card, pag) {
  const res = await fetch(
    `https://api.pokemontcg.io/v2/cards?page=${pag}&pageSize=${card}`
  );
  const data = await res.json();
  console.log(data);

  data.data.forEach((el) => {
    const html = `
      <div class="card" data-name="${el.name}">
          <div class="card__top-info">
            <h2>${el.name}</h2>
            <span>Nr: ${el.nationalPokedexNumbers[0]}</span>
          </div>
          <div class="card__image">
            <img
              class="image"
              src="${el.images.small}"
              alt="pokemon photo"
            />
          </div>
          <div class="card__bottom-info">
            <p><span>Supertype:</span> ${el.supertype}</p>
            <p><span>Subtype:</span> ${el.subtypes[0]}</p>
            <p><span>Rarity:</span> ${el.rarity}</p>
          </div>
        </div>
      `;

    dots.forEach((dot) => dot.classList.add("hidden"));
    buttonDiv.classList.remove("hidden");
    catalog.insertAdjacentHTML("beforeend", html);
  });
};
getInitialCards(cardsCount, page);

// Load more button
loadMore.addEventListener("click", function () {
  buttonDiv.classList.add("hidden");
  page++;
  getInitialCards(cardsCount, page);
});

// Search input
searchInput.addEventListener("keyup", function (e) {
  const searchValue = e.target.value.toLowerCase();
  Array.from(loadedCards).forEach((el) => el.classList.add("hidden"));
  info.classList.add("hidden");

  Array.from(loadedCards).filter((el) => {
    const name = el.dataset.name.toLowerCase();
    name.includes(searchValue)
      ? el.classList.remove("hidden")
      : el.classList.add("hidden");

    Array.from(loadedCards).every((el) => el.classList.contains("hidden"))
      ? info.classList.remove("hidden")
      : info.classList.add("hidden");
  });
});
