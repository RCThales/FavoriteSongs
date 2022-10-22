let favorites = []
let favoriteIds = []
let songs = []
let limit = 10;

window.addEventListener('load', (e) => {

    if(localStorage.getItem('Favorites') !== null) favorites = JSON.parse(localStorage.getItem('Favorites'))

    if(localStorage.getItem('FavoriteIds') !== null) favoriteIds = JSON.parse(localStorage.getItem('FavoriteIds'))

    console.log(favorites);
    console.log(favoriteIds);
    
    document.getElementById('currentLimit').textContent = limit

   //Defining initial behavior depending on the page
   switch(location.pathname){
    case '/favorites.html':
        renderFavoriteSongs()
        break
    case '/index.html':
       //Cleaning input
        const input = document.getElementById('search')
        input.value = ''

           if(localStorage.getItem('lastSearch') !== null){
        input.value = localStorage.getItem('lastSearch')
        }

        searchSongs(input.value)
        break;
   }

})

//Avoid that the songs are played at the same time
document.addEventListener('play', element => {
    let audios = document.getElementsByTagName('audio');

    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != element.target){
            audios[i].pause();
        }
    }

}, true);

//Search feature
if(location.pathname === '/index.html'){
    document.getElementById("search").addEventListener('input',(e) => {
        
        searchSongs(e.target.value)
        localStorage.setItem('lastSearch', e.target.value)
    
    })
}

//ITUNES API Request
const searchSongs = (e) => {

    const url = `https://itunes.apple.com/search?media=music&limit=${limit}&term=${e}`

    fetch(url)
    .then(response => response.json())
    .then(response => {
        songs = response.results
        renderSongs(songs)
    })
    .catch(err => {  
        console.error(err)   
    });
}

const renderSongs = (value) => {

    let list = document.getElementById('listing')
    list.innerHTML = ''
    const currentSongs = value.map((element) => ({     
        artWork: element.artworkUrl100,
        trackName: element.trackName,
        artistName: element.artistName,
        previewUrl: element.previewUrl, 
        trackId: element.trackId,   
        isFavorite: false
    }))

        //Showing feedback img if there are no elements
        if(currentSongs.length === 0){
            document.getElementById('noSongs').style.display = 'flex';
            return
        }
        document.getElementById('noSongs').style.display = 'none';

        //MAIN LOOP
        currentSongs.forEach(element => {

        if(favoriteIds.indexOf(element.trackId) !== -1){
            element.isFavorite = true
        }

        const card = document.createElement('div')
        card.className = 'card'

        const cardDown = document.createElement('div')
        cardDown.className = 'cardDown'

        const cardUp = document.createElement('div')
        cardUp.className = 'cardUp'

        const image = document.createElement('img')
        image.src = element.artWork

        const artistInfo = document.createElement('div')
        artistInfo.className = 'artistInfo'

        const trackName = document.createElement('div')
        trackName.className = 'trackName'

        trackName.innerHTML = element.trackName

        //Checking if song name is too big and creating a hover effect to reveal it
        if(element.trackName.length > 40){
            trackName.innerHTML = ''
            let compressedTrackName = '';
            for (let index = 0; index < 40; index++) {
                trackName.innerHTML += element.trackName[index]       
            }
            compressedTrackName = trackName.innerHTML += '...'

            card.addEventListener('mouseover',(e) => {
                trackName.innerHTML = element.trackName
            })

             card.addEventListener('mouseleave',(e) => {
                trackName.innerHTML = compressedTrackName
            })
        }

        const artistName = document.createElement('div')
        artistName.className = 'artistName'
        artistName.innerHTML = element.artistName 

        //Checking if song name is too big and creating a hover effect to reveal it
        if(element.artistName.length > 40){
            artistName.innerHTML = ''
            let compressedArtistName = '';
            for (let index = 0; index < 40; index++) {
                artistName.innerHTML += element.artistName[index]       
            }
            compressedArtistName = artistName.innerHTML += '...'

            card.addEventListener('mouseover',(e) => {
                artistName.innerHTML = element.artistName
            })

             card.addEventListener('mouseleave',(e) => {
                artistName.innerHTML = compressedArtistName
            })
        }

        artistInfo.appendChild(trackName)
        artistInfo.appendChild(artistName)
        
        const favBtn = document.createElement('button')
        favBtn.className = 'favBtn'
        
        const btnIcon = document.createElement('i')
        btnIcon.className = 'fa fa-heart'
        btnIcon.id = String(element.trackId) 

        favBtn.appendChild(btnIcon)
        favBtn.addEventListener('click', () => {
            if(!element.isFavorite){
                addToFav(element)
                element.isFavorite = true
                return
            } 
            removeFromFav(element)  
             element.isFavorite = false           
        }) 

        const audio = document.createElement('audio')
        audio.controls = true
        const source = document.createElement('source')
        source.src=`${element.previewUrl}`  
        audio.appendChild(source)

        cardDown.appendChild(audio)
        cardUp.appendChild(image)
        cardUp.appendChild(artistInfo)
        cardUp.appendChild(favBtn)


        card.appendChild(cardUp)
        card.appendChild(cardDown)

        list.appendChild(card)

        //ICON STYLING
        if(element.isFavorite){
            btnIcon.className = 'fa fa-heart red'
            btnIcon.parentElement.style.opacity = '1'
        }

    })
}

const renderFavoriteSongs = () => {

    let list = document.getElementById('listingFavorites')
    list.innerHTML = ''

    //Updating the visual feedback if removed all favorites
    let currentFavorites = JSON.parse(localStorage.getItem('Favorites'))
    //Showing feedback img if there are no elements
    if(currentFavorites.length === 0){
        document.getElementById('noSongs').style.display = 'flex';
        return
    }

    document.getElementById('noSongs').style.display = 'none';

    currentFavorites.forEach(element => {

    const card = document.createElement('div')
    card.className = 'card'

    const cardDown = document.createElement('div')
    cardDown.className = 'cardDown'

    const cardUp = document.createElement('div')
    cardUp.className = 'cardUp'

    const image = document.createElement('img')
    image.src = element.artWork

    const artistInfo = document.createElement('div')
    artistInfo.className = 'artistInfo'

    const trackName = document.createElement('div')
    trackName.className = 'trackName'

    trackName.innerHTML = element.trackName

    //Checking if song name is too big and creating a hover effect to reveal it
    if(element.trackName.length > 40){
        trackName.innerHTML = ''
        let compressedName = '';
        for (let index = 0; index < 40; index++) {
            trackName.innerHTML += element.trackName[index]       
        }
        compressedName = trackName.innerHTML += '...'

        card.addEventListener('mouseover',(e) => {
            trackName.innerHTML = element.trackName
        })

            card.addEventListener('mouseleave',(e) => {
            trackName.innerHTML = compressedName
        })
        }

        const artistName = document.createElement('div')
        artistName.className = 'artistName'
        artistName.innerHTML = element.artistName 

        artistInfo.appendChild(trackName)
        artistInfo.appendChild(artistName)
        
        const favBtn = document.createElement('button')
        favBtn.className = 'favBtn'
        
        const btnIcon = document.createElement('i')
        btnIcon.className = 'fa fa-heart red'
        btnIcon.id = String(element.trackId) 

        favBtn.appendChild(btnIcon)

        const audio = document.createElement('audio')
        audio.controls = true
        const source = document.createElement('source')
        source.src=`${element.previewUrl}`  
        audio.appendChild(source)

        cardDown.appendChild(audio)
        cardUp.appendChild(image)
        cardUp.appendChild(artistInfo)
        cardUp.appendChild(favBtn)


        card.appendChild(cardUp)
        card.appendChild(cardDown)
        list.appendChild(card)

        favBtn.addEventListener('click', () => {
            removeFromFavPage(element, card) 
        }) 

        //ICON STYLING
        btnIcon.parentElement.style.opacity = '1'
        
    })

}

const addToFav = (target) => {

    //Visual effects with the heart icon
    const icon = document.getElementById(target.trackId)
    icon.classList.add('red') 
    icon.parentElement.style.opacity = '1'

    favorites.push(target)
    favoriteIds = favorites.map((element) => element.trackId)

    localStorage.setItem('FavoriteIds', JSON.stringify(favoriteIds))
    localStorage.setItem('Favorites', JSON.stringify(favorites))

    const toastLiveExample = document.querySelector('.toastAdd')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()


}

const removeFromFav = (target) => {
    //Visual effects with the heart icon
    const icon = document.getElementById(target.trackId)
    icon.classList.remove('red') 
    icon.parentElement.style.opacity = '0'

    const index = favoriteIds.indexOf(target.trackId)
    favorites.splice(index, 1)
    favoriteIds.splice(index, 1)

    localStorage.setItem('FavoriteIds', JSON.stringify(favoriteIds))
    localStorage.setItem('Favorites', JSON.stringify(favorites))

    const toastLiveExample = document.querySelector('.toastRemove')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}

const removeFromFavPage = (target, div) => {
    //Visual effects with the heart icon
    const icon = document.getElementById(target.trackId)
    icon.classList.remove('red') 
    icon.parentElement.style.opacity = '0'

    const index = favoriteIds.indexOf(target.trackId)
    favorites.splice(index, 1)
    favoriteIds.splice(index, 1)

    localStorage.setItem('FavoriteIds', JSON.stringify(favoriteIds))
    localStorage.setItem('Favorites', JSON.stringify(favorites))

    const toastLiveExample = document.querySelector('.toastRemove')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()

    //Removing card from the DOM
    div.remove()  

    //Showing feedback img if there are no elements
    if(favoriteIds.length === 0){
        document.getElementById('noSongs').style.display = 'flex';
    }
}

const changeLimit = (value) => {
    limit = value
    searchSongs(localStorage.getItem('lastSearch'))
    document.getElementById('currentLimit').textContent = limit
    
}
