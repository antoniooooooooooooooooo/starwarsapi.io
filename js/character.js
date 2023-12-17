document.addEventListener('DOMContentLoaded', function () {
    const characterId = getCharacterIdFromUrl();
    fetchCharacterDetails(characterId);
});

async function fetchCharacterDetails(characterId) {
    const characterDetailsContainer = document.getElementById('character-details-container');

    try {

        const response = await fetch(`https://swapi.dev/api/people/${characterId}/`);
        const characterDetails = await response.json();


        const homeworldResponse = await fetch(characterDetails.homeworld);
        const homeworldDetails = await homeworldResponse.json();

        const filmsDetails = await Promise.all(characterDetails.films.map(async filmUrl => {
            const filmResponse = await fetch(filmUrl);
            return filmResponse.json();
        }));

        const speciesDetails = await Promise.all(characterDetails.species.map(async speciesUrl => {
            const speciesResponse = await fetch(speciesUrl);
            return speciesResponse.json();
        }));



const characterDetailsCard = document.createElement('div');
characterDetailsCard.classList.add('character-details-card');
characterDetailsCard.innerHTML = `
<div id="info-image">
    <img src="https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg" alt="${characterDetails.name}" class="character-image">
    </div>
    <div class="info-character">
    <h2>${characterDetails.name}</h2>
    <p><strong>Gender:</strong> ${characterDetails.gender}</p>
    <p><strong>Birth Year:</strong> ${characterDetails.birth_year}</p>
    <p><strong>Height:</strong> ${characterDetails.height} cm</p>
    <p><strong>Mass:</strong> ${characterDetails.mass} kg</p>
    <p><strong>Eye Color:</strong> ${characterDetails.eye_color}</p>
    <p><strong>Homeworld:</strong> ${homeworldDetails.name}</p>
    <p><strong>Films:</strong> ${filmsDetails.map(film => film.title).join(', ')}</p>
    <p><strong>Species:</strong> ${speciesDetails.length > 0 ? speciesDetails.map(species => species.name).join(', ') : 'Human'}</p>
    </div>
`;
characterDetailsContainer.appendChild(characterDetailsCard);

    } catch (error) {
        console.error('Error fetching character details:', error);
    }
}

function getCharacterIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
