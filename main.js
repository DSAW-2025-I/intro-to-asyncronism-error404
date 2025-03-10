const listaPokemon = document.querySelector("#listaPokemon");
let URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let EVOLUTION_URL = "https://pokeapi.co/api/v2/evolution-chain/";
let pokemons = [];

const obtenerPokemon = async () => {
    for (let i = 1; i <= 1025; i++) {
        try {
            // Endpoint 1: Basic Pokemon data
            const pokemonResponse = await fetch(URL + i);
            const pokemonData = await pokemonResponse.json();
            
            // Endpoint 2: Species data
            const speciesResponse = await fetch(SPECIES_URL + i);
            const speciesData = await speciesResponse.json();
            
            // Endpoint 3: Evolution chain
            const evolutionId = speciesData.evolution_chain.url.split('/').slice(-2)[0];
            const evolutionResponse = await fetch(EVOLUTION_URL + evolutionId);
            const evolutionData = await evolutionResponse.json();

            // Combine all data
            const combinedData = {
                ...pokemonData,
                species: speciesData,
                evolution: evolutionData
            };

            pokemons.push(combinedData);
            mostrarPokemon(combinedData);
        } catch (error) {
            console.error(`Error fetching Pokemon ${i}:`, error);
        }
    }
};

const mostrarPokemon = (data) => {
    let tipos = data.types.map(type => `
        <p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>    
    `).join('');

    let statsHTML = data.stats.map(stat => `
        <div class="stat-row">
            <span class="stat-name">${stat.stat.name.toUpperCase()}</span>
            <span class="stat-value">${stat.base_stat}</span>
        </div>
    `).join('');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" />
        <span class="info-container">
          <h2>${data.name.toUpperCase()}</h2>
          <h3>#${data.id}</h3>
        </span>
        <div class="types">
            ${tipos}
        </div>
        <div class="pokemon-stats">
          <p class="stat" style="margin-bottom: 0;">${data.height / 10} M</p>
          <p class="stat">${data.weight / 10} KG</p>
        </div>
        <div class="stats-modal" style="display: none;">
            <div class="modal-content">
                <h3 style="text-align: center; margin-bottom: 20px;">Base Stats</h3>
                ${statsHTML}
                <div class="stat-row">
                    <span class="stat-name">HABITAT</span>
                    <span class="stat-value">${data.species.habitat ? data.species.habitat.name.toUpperCase() : 'UNKNOWN'}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-value">${data.species.generation.name.toUpperCase()}</span>
                </div>
                <button class="close-modal">Close</button>
            </div>
        </div>
    `;
    
    // Add click event listener to the div
    div.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-modal')) {
            div.querySelector('.stats-modal').style.display = 'none';
        } else {
            div.querySelector('.stats-modal').style.display = 'flex';
        }
    });
    
    listaPokemon.append(div);
};

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredPokemons = pokemons.filter(
            (pokemon) =>
                pokemon.name.toLowerCase().includes(searchValue) ||
                pokemon.id.toString().includes(searchValue)
        );

        listaPokemon.innerHTML = "";
        filteredPokemons.forEach(mostrarPokemon);
    });

    const botonesFiltro = document.querySelectorAll(".btn-header");
    
    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
            const tipo = boton.id;
            if (tipo === "ver-todos") {
                listaPokemon.innerHTML = "";
                pokemons.forEach(mostrarPokemon);
            } else {
                const filtrados = pokemons.filter((pokemon) => 
                    pokemon.types.some((t) => t.type.name === tipo)
                );
                listaPokemon.innerHTML = "";
                filtrados.forEach(mostrarPokemon);
            }
        });
    });
});

obtenerPokemon();
