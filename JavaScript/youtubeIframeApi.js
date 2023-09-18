const url = window.location.search;
const urlParams = new URLSearchParams(url);
const movieId = urlParams.get('vId');

// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: movieId,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'enablejsapi': 1,
            'autoplay': 0,
            'rel': 0,
            'origin': 'http://127.0.0.1:5500'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onError
        }
    });
}

// Variables
let done = false;
let pause = true;

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

    const play = document.querySelector('.play');
    const buttons = play.parentElement;

    play.addEventListener('click', (eventObj) => {
        if (pause === true) {
            console.log("Play the video");
            event.target.playVideo();
            pause = false;
            done = false;
            const pauseBtn = document.createElement('button');
            pauseBtn.classList.add("pause");
            pauseBtn.innerHTML = '<i class="pauseBtn fa-solid fa-pause"></i> Pause';

            buttons.appendChild(pauseBtn);

            const muteBtn = buttons.querySelector('.mute');
            addOrRemoveMuteButton('remove');

            pauseBtn.addEventListener('click', (eventObj) => {
                pauseVideo();
                pause = true;
                pauseBtn.remove();
                console.log('Pause the video');

                addOrRemoveMuteButton('add');
            });
        }
    });


}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (!done && event.data === YT.PlayerState.ENDED) {
        stopVideo();
        const buttons = document.querySelector('.buttons');
        const pauseBtn = buttons.querySelector('.pause');
        pauseBtn.remove();
        addOrRemoveMuteButton('add');
        done = true;
        pause = true;
    }
}

function pauseVideo() {
    player.pauseVideo();
}

function stopVideo() {
    player.stopVideo();
}

function addOrRemoveMuteButton(task) {
    const buttons = document.querySelector('.buttons');
    const unmute = buttons.querySelector('.unmute');
    const mute = buttons.querySelector('.mute');

    if (task === 'add') {
        player.mute();
        mute.style.visibility = "visible";
    }
    else {
        player.unMute();
        mute.style.visibility = "hidden";

        unmute.addEventListener('click', (event) => {
            addOrRemoveMuteButton('add');
        });
    }
}

const mute = document.querySelector('.mute');

mute.addEventListener('click', (event) => {
    addOrRemoveMuteButton('remove');
});

function onError(event) {
    const videoContainer = document.querySelector('.video_container');
    videoContainer.remove();
}