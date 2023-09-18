// Attach event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    //& Code Starts Here
    const movieCategorySection = document.querySelector('.movie_categories_section');


    //& Functions Definition Start Here
    const showAndHideIcons = (moviesContainer, movieCarousel, maxScrollingWidth) => {                       
        const prev = moviesContainer.querySelector('#prev');
        const next = moviesContainer.querySelector('#next');

        setTimeout(() => {
            prev.style.display = movieCarousel.scrollLeft === 0 ? 'none' : 'block';
            next.style.display = movieCarousel.scrollLeft >= maxScrollingWidth ? 'none' : 'block';                
        }, 10);
    }


    // Carousels of Movies List
    const movieCarousels = movieCategorySection.querySelectorAll('.movies_list');

    // Attaching click event to movieCategoriesSection
    // Attach event listeners to dynamically generated icons using event delegation
    movieCategorySection.addEventListener('click', (event) => {
        // Prev or Next icon 
        const icon = event.target;

        // If prev icon clicked then
        if (icon.matches('#prev')) {
            const parent = icon.parentElement;
            const movieCarousel = parent.querySelector('.movies_list');
            const firstImg = movieCarousel.querySelector('.movie_item');
            const firstImgWidth = firstImg.clientWidth;

            // Scrolling width is width of four movie_item + column gap of four movie_item 
            const scrollingWidth = (firstImgWidth * 3) + (8 * 3);

            

            // Maximum scrolling widh of carousel i.e scrollable width of carousel - visible width of carousel
            const maxScrollingWidth = movieCarousel.scrollWidth - movieCarousel.clientWidth;

            // Subtracting scrolling width from scrollleft of movie carousel to scroll to right 
            movieCarousel.scrollLeft -= scrollingWidth;

            setTimeout(() => {
                showAndHideIcons(parent, movieCarousel, maxScrollingWidth);
            }, 50);
        }
        // If next icon clicked then
        else if (icon.matches('#next')) {
            const parent = icon.parentElement;
            const movieCarousel = parent.querySelector('.movies_list');
            const firstImg = movieCarousel.querySelector('.movie_item');
            const firstImgWidth = firstImg.clientWidth;

            const scrollingWidth = (firstImgWidth * 3) + (8 * 3);

            // Maximum scrolling widh of carousel i.e scrollable width of carousel - visible width of carousel
            const maxScrollingWidth = movieCarousel.scrollWidth - movieCarousel.clientWidth;

            // Adding scrolling width from scrollleft of movie carousel to scroll to left 
            movieCarousel.scrollLeft += scrollingWidth + 5;

            setTimeout(() => {
                showAndHideIcons(parent, movieCarousel, maxScrollingWidth);
            }, 50);
        }
    });

    // Attaching mousemove event to movieCategoriesSection
    movieCategorySection.addEventListener('mousemove', (event) => {
        const element = event.target;

        if(element.classList.contains('movies_list')) {
            const movieCarousel = event.target;

            movieCarousel.addEventListener('scroll', (carouselEventObj) => {
                setTimeout(() => {
                    showAndHideIcons(movieCarousel.parentElement, movieCarousel, movieCarousel.scrollWidth - movieCarousel.clientWidth);                    
                    console.log(movieCarousel.scrollLeft);
                    console.log(movieCarousel.scrollLeft - movieCarousel.clientWidth);
                }, 100);
            })
        }
    });
});