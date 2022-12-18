const catalog = document.querySelector('.catalog') as HTMLDivElement;
const info = document.querySelector('.catalog__info') as HTMLDivElement;
const buttonDiv = document.querySelector('.button') as HTMLDivElement;
const loadMore = document.querySelector('.btn') as HTMLButtonElement;
const dotDiv = document.querySelector('.loadingDots') as HTMLDivElement;
const searchInput = document.querySelector('.search') as HTMLInputElement;
const loadedCards = document.getElementsByClassName(
	'card'
) as HTMLCollectionOf<HTMLElement>;

let page = 1;
const cardsCount = 4;

interface DataInterface {
	data: {
		name: string;
		nationalPokedexNumbers: number[];
		images: { small: string };
		supertype: string;
		subtypes: string[];
		rarity: string;
	}[];
}

// Show / hide loading dots and button
const showHide = function (...elements: HTMLElement[]) {
	elements.forEach((element) => element.classList.toggle('hidden'));
};

const getInitialCards = async function (card: number, pag: number) {
	try {
		showHide(dotDiv, loadMore);

		const res = await fetch(
			`https://api.pokemontcg.io/v2/cards?page=${pag}&pageSize=${card}`
		);
		const { data }: DataInterface = await res.json();
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
            <p class="${el.rarity ? '' : 'hidden'}"><span>Rarity:</span> ${
				el.rarity
			}</p>
          </div>
        </article>
      `;

			catalog.insertAdjacentHTML('beforeend', html);
		});

		showHide(dotDiv, loadMore);
	} catch (err) {
		console.log(err);
	}
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
searchInput.addEventListener('keyup', function (e: KeyboardEvent) {
	const target = e.target as HTMLInputElement;

	const searchValue = target.value.toLowerCase();

	// Array.from(loadedCards).forEach((el) => el.classList.add("hidden"));

	Array.from(loadedCards).filter((el) => {
		const name = el.dataset.name!.toLowerCase();

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

	if (!info.classList.contains('hidden')) buttonDiv.classList.remove('hidden');
});
