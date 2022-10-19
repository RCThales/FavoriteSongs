document.getElementById("search").addEventListener('keyup',(e) => {
    console.log(e.target.value);

    const url = 'https://itunes.apple.com/search?media=music&limit=10&term=' + e.target.value

    fetch(url)
    .then(response => response.json())
    .then(response => render(response.results))
    
})

const render = (value) => {
    let lista = document.getElementById('listagem')

    lista.innerHTML = ''
    
     value.forEach(element => {
            lista.innerHTML += element.trackName + `<audio src="${element.previewUrl}" type="audio/x-m4a" controls></audio>` + '<br>'
        })

}