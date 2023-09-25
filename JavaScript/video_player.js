// Desktop / Big Devices Timeline
const timeline = document.querySelector('.timeline');

// Dsektop Control Buttons
const play = document.querySelector('.play'); 
const pause = document.querySelector('.pause'); 
const rewind = document.querySelector('.rewind'); 
const rewindPopup = document.querySelector('.backward'); 
const fastForward = document.querySelector('.fast_forward'); 
const fastForwardPopup = document.querySelector('.forward'); 
const volumeHigh = document.querySelector('.vol_high'); 
const mute = document.querySelector('.mute'); 
const pictureInPicture = document.querySelector('.picture_in_picture'); 
const videoButtonsContainer = document.querySelector('.video_control_buttons');
const videoControlsContainer = document.querySelector('.video_controls_container');
let hideControlsContainerTimeout = null;

// Video
const videoContainer = document.querySelector('.video_container');
const videoPlayer = videoContainer.querySelector('video');

setInterval(() => {
    timeline.style.setProperty('--video-progress', `${(videoPlayer.currentTime * 100) / videoPlayer.duration}%`);
    if(videoPlayer.currentTime === videoPlayer.duration) videoButtonsContainer.classList.remove('paused');
}, 1);

/* ------------------------------------------------- || Desktop Devices / Big Devices || ------------------------------------------------------*/
// Handling Timeline when dragged from one point to another
let dragging = false;

timeline.addEventListener('mousemove', (e) => {   
    if(!dragging) return;

    const currX = e.clientX;
    const draggedDistance = currX  - 64;
    const draggedDistancePercent =  ((draggedDistance) * 100) / (timeline.clientWidth);
    videoPlayer.currentTime = (draggedDistancePercent * videoPlayer.duration) / 100;
});

timeline.addEventListener('mouseleave', (e) => {   
    dragging = false;
});

timeline.addEventListener('mouseup', (e) => {   
    dragging = false;
});
// ----------------------------------------------------------------------------------------------------------------
timeline.addEventListener('mousedown', (e) => {
    dragging = true;
});
// ----------------------------------------------------------------------------------------------------------------

// Handling Timeline when clicked at any point
timeline.addEventListener('mousedown', (e) => {
    const clickedCoordinateXValue = e.clientX - 64;
    const clickedCoordinateXValueInPercent = ((clickedCoordinateXValue) * 100) / (timeline.clientWidth);
    videoPlayer.currentTime = (clickedCoordinateXValueInPercent * videoPlayer.duration) / 100;
});

// On mouse hovering displaying video controls container
videoControlsContainer.addEventListener('mouseover', (e) => {
    videoPlayer.style.zIndex = "-1";
    videoControlsContainer.style.display = "flex";
});

// ----------------------------------------------------------------------------------------------------------------
// Hiding the Controls Container when not hovered for more than 1.5 sec while ramaining on the video container
videoPlayer.addEventListener('mousemove', (e) => {
    if(window.innerWidth > 768) {
        videoControlsContainer.style.display = "flex";    

        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        hideControlsContainerTimeout = setTimeout(() => {
            videoControlsContainer.style.display = "none";
        }, 1500);
    }
});

videoPlayer.addEventListener('mouseleave', (e) => {
    if(window.innerWidth > 768) {
        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        videoControlsContainer.style.display = "none";
    }
});

videoPlayer.addEventListener('mouseenter', (e) => {
    if(window.innerWidth > 768) {
        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        videoControlsContainer.style.display = "flex"; 
    }
});
// ----------------------------------------------------------------------------------------------------------------

// Arrow Function to picture in picture the video
const pictureInPictureVideo = (e) => {
    videoPlayer.requestPictureInPicture()
    .then((res) => {
        videoButtonsContainer.classList.remove('paused');
    })
    .catch(error => console.error());
};

// Arrow Function to fast forward the video
const fastForwardVideo = (e) => {
    videoPlayer.currentTime += 5;

    fastForwardPopup.style.visibility = "visible";
    fastForwardPopup.classList.add('fade_up');

    setTimeout(() => {
        fastForwardPopup.classList.remove('fade_up');
        fastForwardPopup.style.visibility = "hidden";
    }, 550);
};

// Arrow Function to rewind the video
const rewindVideo = (e) => {
    videoPlayer.currentTime -= 5;
    rewindPopup.style.visibility = "visible";
    rewindPopup.classList.add('fade_up');

    setTimeout(() => {
        rewindPopup.classList.remove('fade_up');
        rewindPopup.style.visibility = "hidden";
    }, 550);
};

// Arrow Function to unmute the video
const unMuteVideo = (e) => {
    videoPlayer.volume = 1;

    videoButtonsContainer.classList.remove('muted');
};

// Arrow Function to mute the video
const muteVideo = (e) => {
    videoPlayer.volume = 0;

    videoButtonsContainer.classList.add('muted');
};

// Arrow Function to pause the video
const controlVideo = (e) => {
    if(window.innerWidth > 768) {
        if(videoPlayer.paused) videoPlayer.play();
        else videoPlayer.pause(); 

        videoButtonsContainer.classList.toggle('paused');
    }
};

// Arrow Function to pause the video
const pauseVideo = (e) => {
    videoPlayer.pause();
    videoButtonsContainer.classList.remove('paused');
};

// Arrow Function to play the video
const playVideo = (e) => {
    videoPlayer.play();
    videoButtonsContainer.classList.add('paused');
};

// Adding Click Event to play button
play.addEventListener('click', playVideo);

// Adding Click Event to play button
pause.addEventListener('click', pauseVideo);

// Adding Click Event to Video Player
videoPlayer.addEventListener('click', controlVideo);

// Adding Click Event to volume high button
volumeHigh.addEventListener('click', muteVideo);

// Adding Click Event to mute button
mute.addEventListener('click', unMuteVideo);

// Adding Click Event to rewind button
rewind.addEventListener('click', rewindVideo);

// Adding Click Event to fast forward button
fastForward.addEventListener('click', fastForwardVideo);

// Adding Click Event to picture in picture button
pictureInPicture.addEventListener('click', pictureInPictureVideo);
/* ------------------------------------------------- || Desktop Devices / Big Devices || ------------------------------------------------------*/

// ---------------------------------------------------------------------------------------------------------------------------------------- //

/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
// Touch Devices Timeline
const touchTimeline = document.querySelector('.touch_devices_video_controls .timeline');
const timelinePadding = 16;

// Dsektop Control Buttons
const touchDevicesControlsContainer = document.querySelector('.video_container .touch_devices_video_controls');
const touchPlay = touchDevicesControlsContainer.querySelector('.play'); 
const touchPause = touchDevicesControlsContainer.querySelector('.pause'); 
const touchRewind = touchDevicesControlsContainer.querySelector('.rewind'); 
const touchFastForward = touchDevicesControlsContainer.querySelector('.fast_forward'); 
const touchDevicesButtonsContainer = touchDevicesControlsContainer.querySelector('.touch_devices_control_buttons');
let hideTouchDevicesControlsContainerTimeout = null;

setInterval(() => {
    touchTimeline.style.setProperty('--video-progress', `${(videoPlayer.currentTime * 100) / videoPlayer.duration}%`);
    if(videoPlayer.currentTime === videoPlayer.duration) touchDevicesButtonsContainer.classList.remove('paused');
}, 1);

/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
// Handling Timeline when dragged from one point to another
let timelineDragging = false;
let prevXCoordinate = null;

touchTimeline.addEventListener('touchmove', (e) => {
    if(!timelineDragging) return;
    const currX = e.touches[0].clientX - timelinePadding;
    const draggedDistancePercent =  ((currX) * 100) / (touchTimeline.clientWidth);
    videoPlayer.currentTime = (draggedDistancePercent * videoPlayer.duration) / 100;

    autoHideControlsContainer(3500);
});

touchTimeline.addEventListener('touchend', (e) => {
    timelineDragging = false;
});
// ----------------------------------------------------------------------------------------------------------------
touchTimeline.addEventListener('touchstart', (e) => {
    timelineDragging = true;
    prevXCoordinate = e.touches[0].clientX - timelinePadding;
});
// ----------------------------------------------------------------------------------------------------------------

// Handling Timeline when clicked at any point
touchTimeline.addEventListener('touchstart', (e) => {
    const clickedCoordinateXValue = e.touches[0].clientX - timelinePadding;
    const clickedCoordinateXValueInPercent = ((clickedCoordinateXValue) * 100) / (touchTimeline.clientWidth);
    videoPlayer.currentTime = (clickedCoordinateXValueInPercent * videoPlayer.duration) / 100;
});

// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

const autoHideControlsContainer = (timeoutTime) => {
    // // Clearing previous timeouts so that only one timeout will be active at one time
    clearTimeout(hideTouchDevicesControlsContainerTimeout);

    hideTouchDevicesControlsContainerTimeout = setTimeout(() => {
        touchDevicesControlsContainer.classList.toggle('flex');
        console.log('fast');
    }, timeoutTime);
};

// Arrow Function to fast forward the video
const fastForwardVideoPlayer = (e) => {
    videoPlayer.currentTime += 5;
    touchDevicesControlsContainer.classList.toggle('flex');
    
    // Clearing previous timeouts so that only one timeout will be active at one time
    clearTimeout(hideTouchDevicesControlsContainerTimeout);
    
    autoHideControlsContainer(2500);

    // fastForwardPopup.style.visibility = "visible";
    // fastForwardPopup.classList.add('fade_up');

    // setTimeout(() => {
    //     fastForwardPopup.classList.remove('fade_up');
    //     fastForwardPopup.style.visibility = "hidden";
    // }, 550);
};

// Arrow Function to rewind the video
const rewindVideoPlayer = (e) => {
    videoPlayer.currentTime -= 5;
    
    autoHideControlsContainer(2500);

    // rewindPopup.style.visibility = "visible";
    // rewindPopup.classList.add('fade_up');

    // setTimeout(() => {
    //     rewindPopup.classList.remove('fade_up');
    //     rewindPopup.style.visibility = "hidden";
    // }, 550);
};

// Arrow Function to pause the video
const controlVideoPlayer = (e) => {
    e.preventDefault();
    const element = e.target; 

    if(window.innerWidth <= 768 && (!element.classList.contains('play') && !element.classList.contains('pause') && !element.classList.contains('rewind') && !element.classList.contains('timeline'))) {
        touchDevicesControlsContainer.classList.toggle('flex');

        autoHideControlsContainer(2500); 
    }
};

// Arrow Function to pause the video
const pauseVideoPlayer = (e) => {
    videoPlayer.pause();
    touchDevicesButtonsContainer.classList.remove('paused');
    
    autoHideControlsContainer(2500);
};

// Arrow Function to play the video
const playVideoPlayer = (e) => {
    videoPlayer.play();
    touchDevicesButtonsContainer.classList.add('paused');

    autoHideControlsContainer(2500);
};

// Adding Click Event to play button
touchPlay.addEventListener('click', playVideoPlayer);

// Adding Click Event to play button
touchPause.addEventListener('click', pauseVideoPlayer);

// Adding Click Event to Video Player
videoContainer.addEventListener('click', controlVideoPlayer);

// Adding Click Event to rewind button
touchRewind.addEventListener('click', rewindVideoPlayer);

// Adding Click Event to fast forward button
touchFastForward.addEventListener('click', fastForwardVideoPlayer);

window.addEventListener('orientationchange', (e) => {
  
    const orientationObj = screen.orientation;
    if(orientationObj.angle === 90 || orientationObj.angle === -90) {
        document.querySelector('.landscape_orientation').style.display = "block";
        videoContainer.style.display = "none";
    }
    else {
        document.querySelector('.landscape_orientation').style.display = "none";
        videoContainer.style.display = "block";
    }
});
/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
