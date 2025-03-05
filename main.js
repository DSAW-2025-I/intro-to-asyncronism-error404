let URL = "https://pokeapi.co/api/v2/" ;

for (let i=0;i<152;i++){
    fetch (URL + i)
        .then((response)=>response.json())
        .then (data => mostrarPokemon(data))
}