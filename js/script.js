document.addEventListener('DOMContentLoaded', function () {
    fetchCharactersWithPagination(1); // Start with page 1
});

async function fetchCharactersWithPagination(page) {
    const peopleContainer = document.getElementById('people-container');

    try {

        const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        const data = await response.json();
        const characters = data.results;


        characters.forEach(async person => {
            const response = await fetch(person.url);
            const details = await response.json();
        
            const personCard = document.createElement('div');
            personCard.classList.add('person-card');
        
            personCard.innerHTML = `
                <a href="character.html?id=${extractIdFromUrl(person.url)}">
                    <img src="https://starwars-visualguide.com/assets/img/characters/${person.url.split('/').slice(-2, -1)}.jpg" alt="${person.name}" class="person-image">
                    <h3>${person.name}</h3>
                </a>
            `;
        
            peopleContainer.appendChild(personCard);
        });


        if (data.next) {
            fetchCharactersWithPagination(page + 1);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function extractIdFromUrl(url) {
    const id = url.split('/').filter(Boolean).pop();
    return id;
}

function sortCharactersAlphabetically() {
    const peopleContainer = document.getElementById('people-container');
    const personCards = Array.from(peopleContainer.children);


    personCards.sort((a, b) => {
        const nameA = a.querySelector('h3').innerText.toLowerCase();
        const nameB = b.querySelector('h3').innerText.toLowerCase();
        return nameA.localeCompare(nameB);
    });


    peopleContainer.innerHTML = '';


    personCards.forEach(card => {
        peopleContainer.appendChild(card);
    });
}

async function fetchCharactersByMovie() {
    const peopleContainer = document.getElementById('people-container');
    const movieDropdown = document.getElementById('movie-dropdown');
    const selectedMovie = movieDropdown.value;

    try {

        const response = await fetch(`https://swapi.dev/api/films/${selectedMovie}/`);
        const data = await response.json();
        const characters = data.characters;


        peopleContainer.innerHTML = '';


        characters.forEach(async characterUrl => {
            const response = await fetch(characterUrl);
            const characterDetails = await response.json();

            const personCard = document.createElement('div');
            personCard.classList.add('person-card');
            personCard.innerHTML = `
                <img src="https://starwars-visualguide.com/assets/img/characters/${characterUrl.split('/').slice(-2, -1)}.jpg" alt="${characterDetails.name}" class="person-image">
                <h3>${characterDetails.name}</h3>
            `;
            peopleContainer.appendChild(personCard);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function searchCharacters() {
    const peopleContainer = document.getElementById('people-container');
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const personCards = Array.from(peopleContainer.children);


    personCards.forEach(card => {
        const characterName = card.querySelector('h3').innerText.toLowerCase();
        if (characterName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


