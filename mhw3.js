
function onResponse(response){
  if(response.ok){
    return response.json();
  }
  throw Error(response.statusText);
}

function onModalClickListener(){
  modal.classList.add("hidden");
  document.body.classList.remove("no-scroll")
  modal.querySelector("img").src="";
}

function onImgError(error){
  console.error("Immagine non disponibile: " + error);
  modal.querySelector("img").src = NO_IMAGE_AVAILABLE;
}

function onImgJson(json){
  modal.querySelector("img").src = OP_COVER_OLID_URL+json.olid+"-L.jpg";
}

function checkCoverBookByISBN(isbn){
  const check_cover_url = OP_COVER_ISBN_URL + isbn + ".json?default=false";
  fetch(check_cover_url).then(onResponse).then(onImgJson).catch(onImgError);
}

function onBookJson(json){
  const doc = json.docs[0];
  const isbn = doc.isbn[0];
  checkCoverBookByISBN(isbn);
}

function searchBookByName(bookName){
  const encoded_url = OP_SEARCH_URL + "title=" + encodeURIComponent(bookName) + "&author=" + AUTHOR_BOOKS;
  fetch(encoded_url).then(onResponse).then(onBookJson);
}

function onBookClickListener(event){
  document.body.classList.add("no-scroll");
  modal.querySelector("img").src=LOADING_IMAGE;
  modal.classList.remove("hidden");
  const span = event.currentTarget;
  searchBookByName(BOOKS_NAME[span.dataset.book]);
}

const NO_IMAGE_AVAILABLE = "images/NO_IMAGE_AVAILABLE.jpg";
const LOADING_IMAGE = "https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=790b76110a342e6b0f1ef2595baf82d5a81a6cdac069ea19&rid=giphy.gif&ct=g";
const OP_SEARCH_URL="http://openlibrary.org/search.json?";
const OP_COVER_OLID_URL="http://covers.openlibrary.org/b/olid/";
const OP_COVER_ISBN_URL="http://covers.openlibrary.org/b/isbn/";
const AUTHOR_BOOKS = "tolkien";
const BOOKS_NAME = ["The Hobbit","The Fellowship of the Ring","The Two Towers","The Return of the King"];
const modal = document.querySelector("#modal-view");
const spans = document.querySelectorAll("section p span");

for (const i of spans) {
  i.addEventListener("click",onBookClickListener);
}
modal.addEventListener("click",onModalClickListener);


/**
 * ---------------------------------------------------------------------------------------
 */


function onAlbumJson(json){
  const div = document.querySelector("#tracks-wrapper");
  let num = 1;
  for (const track of json.tracks.items) {
    const a = document.createElement("a");
    const span = document.createElement("span");
    a.href = track.external_urls.spotify;
    span.textContent = num + ") " + track.name;
    num++;
    a.appendChild(span);
    div.appendChild(a);
  }

  album_wrapper.classList.remove("hidden");
}

function getAlbumInfoByAlbumID(album_id){
  fetch(SPOTIFY_ALBUM_URL+album_id,
    {
      headers :{
        "Authorization" : "Bearer " + token
      }
    }).then(onResponse).then(onAlbumJson);
}

function onSeachJson(json){
  const albums_array = json.albums.items;
  let choice;
  for (const album of albums_array) {
    if(album.album_type==="compilation"){
      choice=album;
      break;
    }
  }
  const header1 = document.querySelector("#album-title");
  header1.textContent = choice.name;
  const cover_album = choice.images[1].url;
  const link_album = document.querySelector("#album-link");
  link_album.href = choice.external_urls.spotify;
  const img = document.querySelector("#album-image");
  img.src = cover_album;
  const album_id = choice.id;
  getAlbumInfoByAlbumID(album_id);
}

function searchAlbumsByFilmName(filmName){
  const film_name_encoded = encodeURIComponent(filmName);
  const encoded_search_url =SPOTIFY_SEARCH_URL + "type=album" + "&q="+ film_name_encoded;
    fetch(encoded_search_url,
      {
        headers :{
          "Authorization" : "Bearer " + token
        }
      }).then(onResponse).then(onSeachJson);
}

function onSearchClickListener(event){
  event.preventDefault();

  if(!album_wrapper.classList.contains("hidden")){
    album_wrapper.classList.add("hidden");
    const div = document.querySelector("#tracks-wrapper");
    div.innerHTML="";
  }

  const film_input = document.querySelector("#film");
  if(film_input.value!==""){
    searchAlbumsByFilmName(film_input.value);
  }
}


function onTokenJson(json){
  token = json.access_token;
}

function getToken(){
  fetch(SPOTIFY_TOKEN_URL,
    {
      method: "post",
      body: "grant_type=client_credentials",
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET) 
      }
    }).then(onResponse).then(onTokenJson);
}

const SPOTIFY_ALBUM_URL = "https://api.spotify.com/v1/albums/"
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search?";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_CLIENT_ID = "b6bee6573d7b423ca93b79b65c4823ca"
const SPOTIFY_CLIENT_SECRET = "dc9a24d151654077965326a403408d17"

let token;
getToken();
const album_wrapper = document.querySelector("#albums-wrapper");
const form = document.querySelector("#form-music");
form.addEventListener("submit",onSearchClickListener);