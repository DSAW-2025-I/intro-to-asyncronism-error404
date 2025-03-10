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
    const botonesFiltro = document.querySelectorAll(".btn-header");
    const searchContainer = document.querySelector(".search");
    let tiposSeleccionados = new Set();

    // Crear un contenedor para los filtros seleccionados
    const filtrosContainer = document.createElement('div');
    filtrosContainer.classList.add('filtros-container');
    searchContainer.insertBefore(filtrosContainer, searchInput);

    const actualizarBarraBusqueda = () => {
        // Limpiar los botones de filtro existentes
        filtrosContainer.innerHTML = '';

        // Crear y añadir nuevos botones de filtro
        Array.from(tiposSeleccionados).forEach(tipo => {
            const filtroBtn = document.createElement('button');
            filtroBtn.classList.add('filtro-seleccionado', tipo);
            filtroBtn.innerHTML = `
                ${tipo.toUpperCase()}
                <span class="remove-filter">×</span>
            `;
            
            // Añadir evento para eliminar el filtro
            filtroBtn.querySelector('.remove-filter').addEventListener('click', (e) => {
                e.stopPropagation();
                tiposSeleccionados.delete(tipo);
                actualizarBarraBusqueda();
                aplicarFiltros();
            });

            filtrosContainer.appendChild(filtroBtn);
        });
    };

    // Función para aplicar todos los filtros (tipo y texto)
    const aplicarFiltros = () => {
        // Primero filtramos por tipo
        let pokemonsFiltrados = pokemons;
        
        if (tiposSeleccionados.size > 0) {
            pokemonsFiltrados = pokemons.filter((pokemon) =>
                Array.from(tiposSeleccionados).every((tipoSeleccionado) =>
                    pokemon.types.some((t) => t.type.name === tipoSeleccionado)
                )
            );
        }
        
        // Luego filtramos por texto de búsqueda
        const searchValue = searchInput.value.toLowerCase().trim();
        if (searchValue) {
            pokemonsFiltrados = pokemonsFiltrados.filter(
                (pokemon) =>
                    pokemon.name.toLowerCase().includes(searchValue) ||
                    pokemon.id.toString().includes(searchValue)
            );
        }

        // Mostramos los resultados
        listaPokemon.innerHTML = "";
        pokemonsFiltrados.forEach(mostrarPokemon);
    };

    // Evento para la búsqueda por texto
    searchInput.addEventListener("input", () => {
        aplicarFiltros();
    });

    // Evento para los botones de filtro por tipo
    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
            const tipo = boton.id;
            if (tipo === "ver-todos") {
                tiposSeleccionados.clear();
                actualizarBarraBusqueda();
                aplicarFiltros();
            } else {
                if (tiposSeleccionados.has(tipo)) {
                    tiposSeleccionados.delete(tipo);
                } else {
                    tiposSeleccionados.add(tipo);
                }
                actualizarBarraBusqueda();
                aplicarFiltros();
            }
        });
    });
});

obtenerPokemon();