// Consts
const apiKey = "35a13243cc51617756240cd4b86cae9d";
const youtubeApiKey = "AIzaSyAXmDZtGOANP4l7rWr1KrhPpG6IScsn2yU";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgEndpoint = "	https://image.tmdb.org/t/p/original";

const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (categoryId) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${categoryId}`,
    fetchTrendingMovies: `${apiEndpoint}/trending/movie/week?api_key=${apiKey}`,
    searchMovieById: (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`,
    searchYoutubeTrailerId: (movieTitle) => `https://youtube.googleapis.com/youtube/v3/search?q=${movieTitle}+trailer&key=${youtubeApiKey}` 
};

const searchYoutubeTrailerId = (movieTitle) => {
    const res = fetch(apiPaths.searchYoutubeTrailerId(movieTitle));

    return res
     .then(res => res.json())
     .then(res => {
        return res.items[0].id.videoId;
     })
     .catch(error => console.error("Error : " + error));
}

const buildMoviesCategorySection = (movieObj, categoryName) => {
    const movieCategoriesSection = document.querySelector('.movie_categories_section');

    const moviesContainer = document.createElement('div');
    moviesContainer.classList.add('movie_container', 'container'); 

    const moviesListElement = movieObj.map((movie) => {
        const movieTitle = movie.title.length > 30 ? movie.title.slice(0,30) + '...' : movie.title;
        
        return `
            <div class="movie_item">
                <img class="movie_image" src="${imgEndpoint}${movie.backdrop_path}">
                <p class="movie_name">${movieTitle}</p>
                <div class="extra">
                    <div class="buttons">
                        <div class="left_btns">
                            <i class="like fa-regular fa-thumbs-up"></i>                
                            <i class="wishlist fa-regular fa-plus"></i>                         
                        </div>                    
                        <div class="right_btns">
                            <a class="more" target='_blank'><i id='prev' class="more_details fa-solid fa-angle-down"></i></a>                        
                        </div>                    
                    </div>
                    <div class="movie_data">
                        <span class="match">100% Match</span>     
                        <p class='age_limit_box'><span class="age_limit">10+</span></p> 
                        <span class='duration'>2h 30m</span>
                        <p class='hd'><span class="quality">HD</span></p> 
                    </div>    
                    <ul class="movie_genres"></ul>           
                </div>
            </div>
        `;
    }).join('');

    moviesContainer.innerHTML = `
    <i id='prev' class="prev_button fa-solid fa-angle-left"></i>
    <h3 class="category_heading">${categoryName}<span class="explore">Explore more <i class="fa-solid fa-angle-right"></i></span></h3>
        <div class="movies_list">
            ${moviesListElement}
        </div>
    <i id='next' class="next_button fa-solid fa-angle-right"></i>
    `;

    movieCategoriesSection.appendChild(moviesContainer);

    Array.from(movieCategoriesSection.children).forEach(movieCategory => {
        const movieItems = movieCategory.querySelectorAll('.movie_item');
    
        for(let movieItemInd = 0; movieItemInd < movieItems.length; movieItemInd++) {
            // Tasks to perform on mouseenter event
            movieItems[movieItemInd].addEventListener('mouseenter', (event) => {
                // To stop the propagation of event i.e. event does not goes into its child elements
                event.stopImmediatePropagation();

                // Changing match percentage
                const matchElement = movieItems[movieItemInd].querySelector('.match');

                // Generating random match percent for the movie
                const match = Math.floor(Math.random() * 100);
                matchElement.textContent = `${match}% Match`;

                // Changing movie duration
                let movieDuration = null;
                const movieId = movieObj[movieItemInd].id;

                // Fetching movie data from TMDB API based on movie id. 
                const res = fetch(apiPaths.searchMovieById(movieId));
                res
                .then(res => res.json())
                .then(res => {
                    // Storing movie duration from response object to variable
                    movieDuration = res.runtime;
                    
                    // Accessing the duration element from DOM. 
                    const movieDurationElement = movieItems[movieItemInd].querySelector('.duration'); 
                    const hours = Math.floor(movieDuration / 60);
                    const minutes = movieDuration - (hours * 60) - 1;
                    movieDurationElement.textContent = `${hours}h ${minutes}m`;

                    // Changing movies genres
                    const movieGenres = movieItems[movieItemInd].querySelector('.movie_genres');
                    const genres = res.genres.slice(0,3).map(genre => genre.name);
                    const lists = Array.from(genres).map(genre => {                
                        return `<li>${genre}</li>`;
                    }).join('');
                    movieGenres.innerHTML = lists;
                })
                .catch(error => {
                    console.error(error);
                });

                // Changing age limit
                const ageLimitElement = movieItems[movieItemInd].querySelector('.age_limit');
                // Randomly generating age for the age limit element of the movie.
                const ageLimit = Math.floor(Math.random() * 18);
                ageLimitElement.textContent = `${ageLimit}+`;

                // Yt trailer id
                const moreDetailsElement = movieItems[movieItemInd].querySelector('.more');
                moreDetailsElement.addEventListener('click', (eventObj) => {
                    eventObj.stopImmediatePropagation();

                    const titleElement = movieItems[movieItemInd].querySelector('.movie_name');
                    const idPromise = searchYoutubeTrailerId(titleElement.textContent);
                    idPromise
                     .then(id => {
                         const trailerId = id;
                         const movieId = movieObj[movieItemInd].id;
                        window.open(`./HTML/movie_details.html?movieId=${movieId}&vId=${trailerId}`, '_blank');
                     })
                     .catch(error => console.error(error));
                })
                
            });

            // Click Event on Like Button
            const likeBtn = movieItems[movieItemInd].querySelector('.like');
            likeBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                
                if(likeBtn.classList.contains('like')) {
                    likeBtn.classList.remove('like');
                    likeBtn.classList.add('likeBtn_liked');
                    alert('Liked');
                }
                else {
                    likeBtn.classList.add('like');
                    likeBtn.classList.remove('likeBtn_liked');
                    alert('Unliked');
                }
            });

            // Click Event on Wishlist Button
            const wishlistBtn = movieItems[movieItemInd].querySelector('.wishlist');
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
        };
    });
};

const fetchMoviesList = (fetchURL, categoryName) => {
    const res = fetch(fetchURL);
    
    return res
     .then(res => res.json())
     .then(moviesList => {
        const movies = moviesList.results;
        if(Array.isArray(movies) && movies.length) {
            buildMoviesCategorySection(movies, categoryName);
            return movies;
        }
     })
     .catch(err => console.error(err));
}


const updateBannerSection = (movie) => {
    // const movieCategoriesPromise = fetchAllCategories();
    const movieCategoryPromise = fetch(apiPaths.searchMovieById(movie.id));
    let movieCategory = null;

    movieCategoryPromise
     .then(res => res.json())
     .then(res => {
        movieCategory = res.genres[0].name;
        console.log(movieCategory); 
        
        const bannerSection = document.querySelector('.banner');
        bannerSection.style.visibility = "visible";
        bannerSection.style.backgroundImage = `url("${imgEndpoint}${movie.backdrop_path}")`;
    
        const bannerContainer = document.createElement('div');
        bannerContainer.classList.add('banner_container');
    
        bannerContainer.innerHTML = `
            <div class="netflix_tag">
                <img src="./Images/logo_small.png" alt="Netflix Logo">
                <p class="tag_category">FILM</p>
            </div>
            <h3 class="movie_name">${movie.title}</h3>
            <div class="movie_other_details">
                <p class="movie_release_year">${movie.release_date}</p>
                <p class="movie_category">${movieCategory}</p>
            </div>
            <p class="movie_description">${movie.overview}</p>
        `;
    
        bannerSection.appendChild(bannerContainer);
     })
     .catch(error => {
        console.error("error" + error);
        const bannerSection = document.querySelector('.banner');
        bannerSection.style.visibility = "hidden";
    });
}

const fetchTrendingMovies = () => {
    const moviesPromise = fetchMoviesList(apiPaths.fetchTrendingMovies, "Trending on Netflix");
    
    moviesPromise
     .then(movies => {
        const randomIndex = Math.floor(Math.random() * movies.length) - 1;

        // Updating the banner section
        updateBannerSection(movies[randomIndex]);
     })
     .catch(err => console.error(err));
};

const fetchAllCategories = () => {
    const res = fetch(apiPaths.fetchAllCategories)
    
    return res
     .then(res => res.json())
     .then(res => {
        const movieCategories = res.genres;

        if(Array.isArray(movieCategories) && movieCategories.length) {
            movieCategories.forEach(category => {
                if(category.name !== "Documentary") {
                    fetchMoviesList(apiPaths.fetchMoviesList(category.id), category.name);
                }
            });
            return movieCategories;
        }
     })
     .catch(err => console.error(err));
}

const bootApp = () => {
    // Fetch all the movies categories
    fetchAllCategories();

    // Fetch all the trending movies
    fetchTrendingMovies();

    // Handling Scrolling Events 
    window.addEventListener('scroll', () => {
        // Bringing background to header on scroll greater than 5.  
        const header = document.querySelector('header');

        if(window.scrollY > 5) {    
            header.classList.add('black_bg');
        }
        else {
            header.classList.remove('black_bg');
        }
    });
}

window.addEventListener('load', (event) => {
    // Booting the App
    bootApp();
});
