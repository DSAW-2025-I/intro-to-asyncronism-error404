const listaPokemon = document.querySelector("#listaPokemon");
let URL = "https://pokeapi.co/api/v2/pokemon/";

const obtenerPokemon = async () => {
    for (let i = 1; i <= 1025; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();
        mostrarPokemon(data);
    }
};

const mostrarPokemon = (data) => {
    let tipos = data.types.map(type => `
        <p class="${type.type.name} type">${type.type.name}</p>
    `).join('');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" />
        <span class="info-container">
          <h2>${data.name}</h2>
          <h3>#${data.id}</h3>
        </span>
        <div class="types">
        ${tipos}
        </div>
        <div class="pokemon-stats">
          <p class="stat" style="margin-bottom: 0;">${data.height} M</p>
          <p class="stat">${data.weight} KG</p>
        </div>
    `;
    listaPokemon.append(div);
};

obtenerPokemon();