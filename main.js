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
    div.setAttribute("data-id", data.id);
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
    
    div.addEventListener("click", () => {
        mostrarDetallesPokemon(data);
    });
    
    listaPokemon.append(div);
};

const mostrarDetallesPokemon = (data) => {
   
    const modal = document.createElement("div");
    modal.classList.add("modal");
    
    const stats = data.stats.map(stat => `
        <div class="stat-item">
            <span class="stat-name">${stat.stat.name.toUpperCase()}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
            </div>
            <span class="stat-value">${stat.base_stat}</span>
        </div>
    `).join('');
    
    const abilities = data.abilities.map(ability => 
        `<span class="ability">${ability.ability.name.toUpperCase()}</span>`
    ).join('<br>'); //REVISAAAAR
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h2>${data.name.toUpperCase()}</h2>
                <h3>#${data.id}</h3>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" />
                </div>
                <div class="modal-info">
                    <div class="modal-section">
                        <h4>Tipo</h4>
                        <div class="types">
                            ${data.types.map(type => `
                                <p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-section">
                        <h4>Habilidades</h4>
                        <p>${abilities}</p>
                    </div>
                    <h4 class="tittle">Dimensiones</h4>
                    <div class="modal-dimentions">
                        
                        <p>Altura: ${data.height / 10} m</p>
                        <p>Peso: ${data.weight / 10} kg</p>
                    </div>
                    <div class="modal-section">
                        <h4>Estadísticas</h4>
                        <div class="stats-container">
                            ${stats}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
    
    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        modal.classList.remove("show");
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const botonesFiltro = document.querySelectorAll(".btn-header");
    const searchContainer = document.querySelector(".search");
    let tiposSeleccionados = new Set();

    const filtrosContainer = document.createElement('div');
    filtrosContainer.classList.add('filtros-container');
    searchContainer.insertBefore(filtrosContainer, searchInput);

    const actualizarBarraBusqueda = () => {

        filtrosContainer.innerHTML = '';


        Array.from(tiposSeleccionados).forEach(tipo => {
            const filtroBtn = document.createElement('button');
            filtroBtn.classList.add('filtro-seleccionado', tipo);
            filtroBtn.innerHTML = `
                ${tipo.toUpperCase()}
                <span class="remove-filter">×</span>
            `;
            
      
            filtroBtn.querySelector('.remove-filter').addEventListener('click', (e) => {
                e.stopPropagation();
                tiposSeleccionados.delete(tipo);
                actualizarBarraBusqueda();
                aplicarFiltros();
            });

            filtrosContainer.appendChild(filtroBtn);
        });
    };

   
    const aplicarFiltros = () => {
       
        let pokemonsFiltrados = pokemons;
        
        if (tiposSeleccionados.size > 0) {
            pokemonsFiltrados = pokemons.filter((pokemon) =>
                Array.from(tiposSeleccionados).every((tipoSeleccionado) =>
                    pokemon.types.some((t) => t.type.name === tipoSeleccionado)
                )
            );
        }
        
      
        const searchValue = searchInput.value.toLowerCase().trim();
        if (searchValue) {
            pokemonsFiltrados = pokemonsFiltrados.filter(
                (pokemon) =>
                    pokemon.name.toLowerCase().includes(searchValue) ||
                    pokemon.id.toString().includes(searchValue)
            );
        }
       
        listaPokemon.innerHTML = "";
        pokemonsFiltrados.forEach(mostrarPokemon);
    };


    searchInput.addEventListener("input", () => {
        aplicarFiltros();
    });

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