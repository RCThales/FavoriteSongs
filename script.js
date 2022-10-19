window.addEventListener('load', (e) => {
   const input = document.getElementById('search')
   input.value = ''
})


document.getElementById("search").addEventListener('keyup',(e) => {

    const url = 'https://itunes.apple.com/search?media=music&limit=12&term=' + e.target.value

    fetch(url)
    .then(response => response.json())
    .then(response => render(response.results))
    .catch(err => {
        renderError()
        console.error(err)   
    });
    
})

const render = (value) => {
    let list = document.getElementById('listing')

    list.innerHTML = ''
    
     value.forEach(element => {
            list.innerHTML += 
            
            `
            <div id="card">
                <div class="cardUp">
                    <img src='${element.artworkUrl100}'></img>
                    <div class='artistInfo'>
                        <div id="trackName">
                            ${element.trackName}
                        </div>
                        <div id="artistName">
                            ${element.artistName}
                        </div>
                    </div>    

                    <button onclick="addToFav()" id='favBtn'><i class="fa fa-heart"></i></button>
                
                </div>         
                <audio src="${element.previewUrl}" type="audio/x-m4a" controls></audio>
            </div>`
        })

}

const renderError = () => {
    let list = document.getElementById('listing')

    list.innerHTML = 'I could not find any song :('

}

const addToFav = () => {
    alert('added')
}