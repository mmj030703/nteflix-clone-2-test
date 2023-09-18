// Consts
const apiKey = "35a13243cc51617756240cd4b86cae9d";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgEndpoint = "	https://image.tmdb.org/t/p/original";
const youtubeApiKey = "AIzaSyAXmDZtGOANP4l7rWr1KrhPpG6IScsn2yU";

const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (categoryId) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${categoryId}`,
    fetchTrendingMovies: `${apiEndpoint}/trending/movie/week?api_key=${apiKey}`,
    searchMovieById: (movieId) => `${apiEndpoint}/movie/${movieId}?api_key=${apiKey}`,
    fetchCastDetails: (movieId) => `${apiEndpoint}/movie/${movieId}/credits?api_key=${apiKey}`,
    fetchSimilarMovies: (movieId) => `${apiEndpoint}/movie/${movieId}/similar?page=1&api_key=${apiKey}`,
    searchYoutubeTrailerId: (movieTitle) => `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle+' '}+trailer&key=${youtubeApiKey}` 
};

const url = window.location.search;
const urlParams = new URLSearchParams(url);
const movieId = urlParams.get('movieId');
const ytId = urlParams.get('vId');

if(ytId === '0') {
    const videoContainer = document.querySelector('.video_container');
    videoContainer.remove();
}

const fetchAndReturnMovieDeatils = (movieId) => {
    const res = fetch(apiPaths.searchMovieById(movieId));

    return res
     .then(res => res.json())
     .then(movie => {
        return movie;
     })
     .catch(error => console.error(error));
};

const searchYoutubeTrailerId = (movieTitle) => {
    const res = fetch(apiPaths.searchYoutubeTrailerId(movieTitle));

    return res
     .then(res => res.json())
     .then(res => {
         if(res.items[0].snippet.title.toLowerCase().match(movieTitle.toLowerCase())) {
            return res.items[0].id.videoId; 
        }
        else {
            return 0;
        }
     })
     .catch(error => console.error("Error : " + error));
}

const buildSimilarMoviesSection = (moviesObj) => {
    const similarMoviesContainer = document.querySelector('.similar_movies');
    moviesObj.sort((a,b) => {
        return b.popularity - a.popularity;
    });

    moviesObj.slice(0,10).forEach((movieObj) => {
        const moviePromise = fetchAndReturnMovieDeatils(movieObj.id);
        
        moviePromise
            .then(movie => {
                if(movie.backdrop_path !== null) {
                    const hours = Math.floor(movie.runtime / 60);
                    const minutes = Math.floor(((movie.runtime / 60) - (Math.floor(movie.runtime / 60))) * 60);
                    const match = Math.floor(Math.random() * 100);
                    const age = Math.floor(Math.random() * 18);

                    similarMoviesContainer.innerHTML += `
                        <div class="movie">
                            <div class="top">
                                <div class="image">
                                    <img src="${imgEndpoint}/${movie.backdrop_path}" alt="${movie.title} Image">
                                    <div class="image_overlay"></div>
                                </div>
                                <p class="movie_name">${movie.title}</p>
                                ${hours !== 0 && minutes !== 0 ? `<p class="movie_duration">${hours}h ${minutes}m</p>` : ``}
                            </div>
                            <div class="bottom">
                                <div class="movie_details">
                                    <div class="details">
                                        <span class="match">${match}% Match</span>
                                        <div class="other">
                                        <p class='age_limit_box'><span class="age_limit">${age}+</span></p>
                                        <span class="year_of_release">${movie.release_date.slice(0,4)}</span>
                                        </div>
                                    </div>
                                    <div class="buttons">
                                        <i class="wishlist fa-regular fa-plus"></i>
                                        <i data-movie_id=${movie.id} class="more_details fa-solid fa-angle-down"></i>
                                    </div>
                                </div>
                                <p class="description">${movie.overview.length < 200 ? movie.overview : movie.overview.slice(0,200) + '...'}</p>
                            </div>
                        </div>    
                    `;

                    return movie;
                }
            })
            .then(movie => {
                if(movie.backdrop_path !== null) {
                    const movieItems = similarMoviesContainer.children;

                    for(let i = 0; i < movieItems.length; i++) {
                        // Adding event listener to the more details button
                        const more_details = movieItems[i].querySelector('.more_details');
                        more_details.addEventListener('click', (event) => {
                            const titleElement = movieItems[i].querySelector('.movie_name');
                            const idPromise = searchYoutubeTrailerId(titleElement.textContent);

                            idPromise
                            .then(id => {
                                const trailerId = id;
                                const movieId = more_details.dataset.movie_id;
                                window.open(`movie_details.html?movieId=${movieId}&vId=${trailerId}`, '_blank');
                            })
                            .catch(error => console.error(error));
                        })

                        // Click Event on Wishlist Button
                        const wishlistBtn = movieItems[i].querySelector('.wishlist');
                        wishlistBtn.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            
                            if(wishlistBtn.classList.contains('wishlist')) {
                                wishlistBtn.classList.remove('wishlist');
                                wishlistBtn.classList.add('wishlist_clicked');
                                alert('Added to Wishlist');
                            }
                            else {
                                wishlistBtn.classList.add('wishlist');
                                wishlistBtn.classList.remove('wishlist_clicked');
                                alert('Removed from Wishlist');
                            }
                        });
                    }
                }
            })
            .catch(error => console.error(error));
    });
}

// Function for fetching Similar Movies
const fetchSimilarMovies = (movieId) => {
    const res = fetch(apiPaths.fetchSimilarMovies(movieId));

    res
     .then(res => res.json())
     .then(moviesObj => {
        buildSimilarMoviesSection(moviesObj.results.slice(0,20));
     })
     .catch(error => console.error(error));
}

// Function to build the Cast Details Section and insert it into the DOM.
const buildCastDetailsSection = (castObj) => {
    const castContainer = document.querySelector('.cast');
    const castImages = castObj.map(cast => {
        if(cast.known_for_department === 'Acting' && cast.profile_path !== null) {
            return `
            <div class="cast_image">
                <img src="${imgEndpoint}/${cast.profile_path}" alt="${cast.name} Image">
                <p class="cast_name">${cast.name}</p>
            </div>        
            `;
        }
    }).join('');
    
    castContainer.innerHTML = `
        ${castImages}    
    `;
};

// Function for fetching Cast Details
const fetchCastDetails = (movieId) => {
    const res = fetch(apiPaths.fetchCastDetails(movieId));

    res
     .then(res => res.json())
     .then(castObj => {
        buildCastDetailsSection(castObj.cast.slice(0,15));
     })
     .catch(error => console.error(error));
}

// Function to build Movie Details Section
const buildMovieDetailsSection = (movieObj) => {
    const movieDetailsSection = document.querySelector('.movie_details_section');
    const match = Math.floor(Math.random() * 100);
    const age = Math.floor(Math.random() * 18);
    const hours = Math.floor(movieObj.runtime / 60);
    const minutes = Math.floor(((movieObj.runtime / 60) - Math.floor(movieObj.runtime / 60)) * 60);

    movieDetailsSection.innerHTML = `
        <div class="movie_details_container container">
            <h2 class="movie_title">${movieObj.title}</h2>
            <div class="details">
                <div class="movie_details">
                    <div class="extra">
                        <span class="match">${match}% Match</span>
                        <span class="year_of_release">${movieObj.release_date.slice(0,4)}</span>
                        <p class='age_limit_box'><span class="age_limit">${age}+</span></p>
                        <span class='duration'>${hours}h ${minutes}m</span>
                        <p class='hd'><span class="quality">HD</span></p>
                    </div>
                    <div class="description">
                        <h2 class="heading">Overview</h2>
                        <p>${movieObj.overview}</p>
                    </div>
                </div>
                <div class="other_details">
                    <div class="genres">
                        <span>Genres: </span>
                        <ul class="movie_genres"></ul>
                    </div>
                    <div class="language">
                        <span>Available in: </span>
                        <span class="movie_language">${movieObj.spoken_languages[0].english_name}</span>
                    </div>
                </div>
            </div>
        </div>    
    `;

    // Inserting genres in the DOM
    const genres = movieObj.genres;
    const genresElement = movieDetailsSection.querySelector('.movie_genres');

    genres.slice(0,3).forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.name;
        genresElement.append(li);
    });

    const languagesAvailable = {
        'de': 'German',
        'it': 'Italian',
        'la': 'Latin',
        'pl': 'Polish',
        'da': 'Danish',
        'no': 'Norwegian',
        'uk': 'Ukrainian',
        'en': 'English',
        'ca': 'Catalan',
        'hu': 'Hungarian',
        'kn': 'Kannada',
        'ru': 'Russian',
        'sv': 'Swedish',
        'ka': 'Georgian',
        'fi': 'Finnish',
        'fr': 'French',
        'fj': 'Fijian',
        'id': 'Indonesian',
        'gu': 'Gujarati',
        'ja': 'Japanese',
        'ko': 'Korean',
        'nl': 'Dutch',
        'el': 'Greek',
        'bn': 'Bengali',
        'ne': 'Nepali',
        'ur': 'Urdu',
        'ks': 'Kashmiri',
        'or': 'Oriya',
        'ar': 'Arabic',
        'tr': 'Turkish',
        'fa': 'Persian',
        'pa': 'Punjabi',
        'mr': 'Marathi',
        'pt': 'Portuguese',
        'hi': 'Hindi',
        'ht': 'Haitian',
        'ht': 'Haitian',
        'sa': 'Sanskrit',
        'te': 'Telugu',
        'ml': 'Malayalam',
        'es': 'Spanish',
        'he': 'Hebrew',
        'ta': 'Tamil',
    }

    // Inserting genres in the DOM
    const languageElement = movieDetailsSection.querySelector('.movie_language');
    const language = `${movieObj.original_language}`;
    
    if(languagesAvailable[language]) {
        languageElement.textContent = `${languagesAvailable[language]}`;
    }
    else {
        languageElement.remove();
    }
}

// Function for fetching movie details 
const fetchMovieDetails = (movieId) => {
    const res = fetch(apiPaths.searchMovieById(movieId));

    res
     .then(res => res.json())
     .then(movie => {
        buildMovieDetailsSection(movie)
     })
     .catch(error => console.error("Error : " + error));
}

const bootApp = async () => {
    Promise.all([
        fetchMovieDetails(movieId),
        fetchCastDetails(movieId),
        fetchSimilarMovies(movieId)
    ]);
}

window.addEventListener('load', (event) => {
    bootApp();
});
