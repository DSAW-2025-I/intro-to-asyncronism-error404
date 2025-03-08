const listaPokemon = document.querySelector("#listaPokemon");
let URL = "https://pokeapi.co/api/v2/pokemon/";
let pokemons = [];

const obtenerPokemon = async () => {
    for (let i = 1; i <= 1025; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();
        pokemons.push(data);
        mostrarPokemon(data);
    }
};

const mostrarPokemon = (data) => {
    let tipos = data.types.map(type => `
        <p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>    
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
    `;
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
