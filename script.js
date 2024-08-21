const apiKey = 'YOUR_PEXELS_API_KEY';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const firstImageSection = document.getElementById('first-image');
const similarResultsSection = document.getElementById('similar-results');
const favoritesSection = document.getElementById('favorites');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    fetchImages(searchTerm);
});

async function fetchImages(searchTerm) {
    const apiKey = 'GQ3jXKM8wGlbsOJuMKNb2VHQbGcrTAIEBM0MTaoLLUdyXsPE63r82sJJ';
    const response = await fetch(`https://api.pexels.com/v1/search?query=${searchTerm}`, {
        headers: {
            Authorization: apiKey
        }
    });
    const data = await response.json();
    displayFirstImage(data.photos[0]);
    displaySimilarResults(data.photos);
}

function displayFirstImage(image) {
    firstImageSection.innerHTML = `
        <div class="flex items-center gap-10">
            <div class="w-[476px] h-[335px]">
                <img src="${image.src.medium}" alt="${image.alt}" class="w-full h-full rounded mb-4" />
            </div>
            <div class="flex flex-col gap-3">
                <h3 class="text-2xl font-bold">${image.alt}</h3>
                <div>
                    <p class="text-red-600 mb-3">Photographer: ${image.photographer}</p>
                    <a href="${image.photographer_url}" target="_blank" class="text-white px-4 py-2 bg-red-600">Explore more</a>
                </div>
            </div>
        </div>`;
}

function displaySimilarResults(images) {
    similarResultsSection.innerHTML = '';
    images.forEach((image, index) => {
        if (index === 0) return; // Skip the first image since it's displayed separately
        const imageCard = document.createElement('div');
        imageCard.classList.add('border', 'p-4', 'rounded', 'bg-white');
        imageCard.innerHTML = `
            <div class="relative">
                <img src="${image.src.medium}" alt="${image.alt}" class="w-full h-auto rounded mb-4">
                <button class="wishlist-button absolute top-2 right-2 bg-gray-200 p-2 rounded-full" data-index="${index}">
                    ❤️
                </button>
            </div>
            <h3 class="text-lg font-semibold">${image.alt}</h3>
            <p class="text-gray-600">Photographer: ${image.photographer}</p>`;
        similarResultsSection.appendChild(imageCard);
    });
    attachWishlistListeners();
}

function attachWishlistListeners() {
    const wishlistButtons = document.querySelectorAll('.wishlist-button');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            const image = document.querySelector(`#similar-results div:nth-child(${index}) img`);
            const imageData = {
                src: image.src,
                alt: image.alt,
                photographer: image.closest('.relative').nextElementSibling.innerHTML,
            };
            addToFavorites(imageData);
            event.target.classList.add('bg-red-500');
        });
    });
}

function addToFavorites(image) {
    favorites.push(image);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function removeFromFavorites(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    favoritesSection.innerHTML = '';
    favorites.forEach((image, index) => {
        const imageCard = document.createElement('div');
        imageCard.classList.add('border', 'p-4', 'rounded', 'bg-white');
        imageCard.innerHTML = `
            <div class="relative">
                <img src="${image.src}" alt="${image.alt}" class="w-full h-auto rounded mb-4">
                <button class="wishlist-button absolute top-2 right-2 bg-red-500 p-2 rounded-full" data-index="${index}">
                    ❌
                </button>
            </div>
            <h3 class="text-lg font-semibold">${image.alt}</h3>
            <p class="text-gray-600">Photographer: ${image.photographer}</p>`;
        favoritesSection.appendChild(imageCard);
    });
    attachRemoveListeners();
}

function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll('.wishlist-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            removeFromFavorites(index);
        });
    });
}

// Initial render of favorites
renderFavorites();
