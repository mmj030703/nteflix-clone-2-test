/* ------------------------------------------------- || Desktop Devices / Big Devices || ------------------------------------------------------*/

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

// Timeout Variable
let hideControlsContainerTimeout = null;

// Video
const videoContainer = document.querySelector('.video_container');
const videoPlayer = videoContainer.querySelector('video');

// ------------------------------------------------------------------------------------------------------------------------ //
// Updating time in the timeline every 1ms
setInterval(() => {
    // Setting value of CSS Variable --video-progress
    timeline.style.setProperty('--video-progress', `${(videoPlayer.currentTime * 100) / videoPlayer.duration}%`);

    // Updating Time
    if(videoPlayer.currentTime === videoPlayer.duration) videoButtonsContainer.classList.remove('paused');
}, 1);
// ------------------------------------------------------------------------------------------------------------------------ //

// ---------------------------------------------------------------------------------------------------------------- //
// Handling Timeline when dragged from one point to another
// Boolean Varible for checking whether dragging has start or not
let dragging = false;

// Event when mouse is moving on the timeline and moving the timeline pointer along with it.
timeline.addEventListener('mousemove', (e) => {   
    // If dragging is false then return.
    if(!dragging) return;

    // Getting current clicked x coordinate.
    const currX = e.clientX;

    // Distance dragged and removing the additional padding from it.
    const draggedDistance = currX  - 64;

    // Calculating Percentage Value of dragged distance.
    const draggedDistancePercent =  ((draggedDistance) * 100) / (timeline.clientWidth);

    // Updating time.
    videoPlayer.currentTime = (draggedDistancePercent * videoPlayer.duration) / 100;
});

// Event to stop dragging when we leave mouse from timeline.
timeline.addEventListener('mouseleave', (e) => {   
    dragging = false;
});

// Event to stop dragging when we take mouse cursor up from timeline.
timeline.addEventListener('mouseup', (e) => {   
    dragging = false;
});

// Event to start dragging when we take mouse cursor down/on the timeline.
timeline.addEventListener('mousedown', (e) => {
    dragging = true;
});
// ---------------------------------------------------------------------------------------------------------------- //


// Handling Timeline when clicked at any point
timeline.addEventListener('mousedown', (e) => {
    // Distance dragged and removing the additional padding from it.
    const clickedCoordinateXValue = e.clientX - 64;

    // Calculating Percentage Value of dragged distance.
    const clickedCoordinateXValueInPercent = ((clickedCoordinateXValue) * 100) / (timeline.clientWidth);

    // Updating time.
    videoPlayer.currentTime = (clickedCoordinateXValueInPercent * videoPlayer.duration) / 100;
});

// On mouse hovering displaying video controls container
videoControlsContainer.addEventListener('mouseover', (e) => {
    // Making zIndex of video player -1 so that video player controls container can be visible. 
    videoPlayer.style.zIndex = "-1";

    // Making video player controls container visible. 
    videoControlsContainer.style.display = "flex";
});


// ----------------------------------------------------------------------------------------------------------------
// Hiding the Controls Container when not hovered for more than 1.5 sec while ramaining on the video container
videoPlayer.addEventListener('mousemove', (e) => {
    if(window.innerWidth > 768) {
        // First making video player controls container visible. 
        videoControlsContainer.style.display = "flex";    

        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        // Timeout function to remove the video controls container after 1.5 sec 
        hideControlsContainerTimeout = setTimeout(() => {
            videoControlsContainer.style.display = "none";
        }, 1500);
    }
});

// Event when mouse leave the video player hide the video controls container.
videoPlayer.addEventListener('mouseleave', (e) => {
    if(window.innerWidth > 768) {
        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        // Removing video controls container.
        videoControlsContainer.style.display = "none";
    }
});

// Event when mouse enter the video player making vido controls container visible.
videoPlayer.addEventListener('mouseenter', (e) => {
    if(window.innerWidth > 768) {
        // Clearing previous timeouts so that only one timeout will be active at one time
        clearTimeout(hideControlsContainerTimeout);

        // Making visible video controls container.
        videoControlsContainer.style.display = "flex"; 
    }
});
// ----------------------------------------------------------------------------------------------------------------


// Arrow Function to picture in picture the video
const pictureInPictureVideo = (e) => {
    videoPlayer.requestPictureInPicture()
    .then((res) => {
        // Removing video controls container.
        videoButtonsContainer.classList.remove('paused');
    })
    .catch(error => console.error());
};

// Arrow Function to fast forward the video
const fastForwardVideo = (e) => {
    // Adding video player duration by 5sec 
    videoPlayer.currentTime += 5;

    // Popup fastforward icon element making visible and adding fadeup class to make it animate.
    fastForwardPopup.style.visibility = "visible";
    fastForwardPopup.classList.add('fade_up');

    // Removing fastforward popup icon after 550ms.
    setTimeout(() => {
        fastForwardPopup.classList.remove('fade_up');
        fastForwardPopup.style.visibility = "hidden";
    }, 550);
};

// Arrow Function to rewind the video
const rewindVideo = (e) => {
    // Reducing video player duration by 5sec
    videoPlayer.currentTime -= 5;

    // Popup fastforward icon element making visible and adding fadeup class to make it animate.
    rewindPopup.style.visibility = "visible";
    rewindPopup.classList.add('fade_up');

    // Removing rewind popup icon after 550ms.
    setTimeout(() => {
        rewindPopup.classList.remove('fade_up');
        rewindPopup.style.visibility = "hidden";
    }, 550);
};

// Arrow Function to unmute the video
const unMuteVideo = (e) => {
    videoPlayer.volume = 1;

    // Removing muted class so as to make unmute button visible.
    videoButtonsContainer.classList.remove('muted');
};

// Arrow Function to mute the video
const muteVideo = (e) => {
    videoPlayer.volume = 0;

    // Adding muted class so as to make mute button visible.
    videoButtonsContainer.classList.add('muted');
};

// Arrow Function to control the state => (play/pause)
const controlVideo = (e) => {
    // If the width is greater than 768 i.e greater than average touch devices (if block for big devices)
    if(window.innerWidth > 768) {
        // If paused class is active then play the video
        if(videoPlayer.paused) videoPlayer.play();
        // else pause the video
        else videoPlayer.pause(); 

        // Toggle the paused class i.e if not present then add and if present then remove.
        videoButtonsContainer.classList.toggle('paused');
    }
};

// Arrow Function to pause the video
const pauseVideo = (e) => {
    videoPlayer.pause();

    // Removing paused class to make play button visible.
    videoButtonsContainer.classList.remove('paused');
};

// Arrow Function to play the video
const playVideo = (e) => {
    videoPlayer.play();

    // Adding paused class to make play button hidden.
    videoButtonsContainer.classList.add('paused');
};

// Adding Click Event to play button
play.addEventListener('click', playVideo);

// Adding Click Event to pause button
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


/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
// Touch Devices Timeline
const touchTimeline = document.querySelector('.touch_devices_video_controls .timeline');
const timelinePadding = 16;

// Touch Control Buttons
const touchDevicesControlsContainer = document.querySelector('.video_container .touch_devices_video_controls');
const touchPlay = touchDevicesControlsContainer.querySelector('.play'); 
const touchPause = touchDevicesControlsContainer.querySelector('.pause'); 
const touchRewind = touchDevicesControlsContainer.querySelector('.rewind'); 
const touchFastForward = touchDevicesControlsContainer.querySelector('.fast_forward'); 
const touchDevicesButtonsContainer = touchDevicesControlsContainer.querySelector('.touch_devices_control_buttons');

// Timeout Variable
let hideTouchDevicesControlsContainerTimeout = null;

// ------------------------------------------------------------------------------------------------------------------------ //
// Updating time in the timeline every 1ms
setInterval(() => {
    // Setting value of CSS Variable --video-progress
    touchTimeline.style.setProperty('--video-progress', `${(videoPlayer.currentTime * 100) / videoPlayer.duration}%`);

    // Updating Time
    if(videoPlayer.currentTime === videoPlayer.duration) touchDevicesButtonsContainer.classList.remove('paused');
}, 1);
// ------------------------------------------------------------------------------------------------------------------------ //

/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
// Handling Timeline when dragged from one point to another

// Boolean Varible for checking whether dragging has start or not
let timelineDragging = false;

// Event when touch is made on the timeline and moved the timeline pointer along with it.
touchTimeline.addEventListener('touchmove', (e) => {
    // If dragging is false then return.
    if(!timelineDragging) return;

    // Getting current touched x coordinate and removing the additional padding from it => it is the actual distance dragged.
    const currX = e.touches[0].clientX - timelinePadding;

    // Calculating Percentage Value of dragged distance.
    const draggedDistancePercent =  ((currX) * 100) / (touchTimeline.clientWidth);

    // Updating time.
    videoPlayer.currentTime = (draggedDistancePercent * videoPlayer.duration) / 100;

    // Autohiding the touchDevicesControlsContainer after 3500ms
    autoHideControlsContainer(3500);
});

// Event to stop dragging when we end the touching the timeline.
touchTimeline.addEventListener('touchend', (e) => {
    timelineDragging = false;
});
// ----------------------------------------------------------------------------------------------------------------

// Event to start dragging when we touch the timeline.
touchTimeline.addEventListener('touchstart', (e) => {
    timelineDragging = true;
});
// ----------------------------------------------------------------------------------------------------------------

// Handling Timeline when touched at any point
touchTimeline.addEventListener('touchstart', (e) => {
    // Distance dragged and removing the additional padding from it => (dragged distance).
    const clickedCoordinateXValue = e.touches[0].clientX - timelinePadding;

    // Calculating Percentage Value of dragged distance.
    const clickedCoordinateXValueInPercent = ((clickedCoordinateXValue) * 100) / (touchTimeline.clientWidth);

    // Updating time.
    videoPlayer.currentTime = (clickedCoordinateXValueInPercent * videoPlayer.duration) / 100;
});

// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

// Function for auto hiding the touch devices control container after given parameter timeoutTime
const autoHideControlsContainer = (timeoutTime) => {
    // Clearing previous timeouts so that only one timeout will be active at one time
    clearTimeout(hideTouchDevicesControlsContainerTimeout);

    hideTouchDevicesControlsContainerTimeout = setTimeout(() => {
        touchDevicesControlsContainer.classList.toggle('flex');
    }, timeoutTime);
};

// Arrow Function to fast forward the video
const fastForwardVideoPlayer = (e) => {
    // Adding video player duration by 5sec 
    videoPlayer.currentTime += 5;
    touchDevicesControlsContainer.classList.toggle('flex');
    
    // Clearing previous timeouts so that only one timeout will be active at one time
    clearTimeout(hideTouchDevicesControlsContainerTimeout);
    
    // Autohiding the touchDevicesControlsContainer after 2500ms
    autoHideControlsContainer(2500);
};

// Arrow Function to rewind the video
const rewindVideoPlayer = (e) => {
    // Reducing video player duration by 5sec
    videoPlayer.currentTime -= 5;  
    
    // Autohiding the touchDevicesControlsContainer after 2500ms 
    autoHideControlsContainer(2500);
};

// Arrow Function to control the state => (play/pause)
const controlVideoPlayer = (e) => {
    e.preventDefault();
    const element = e.target; 

    // If the width is lesser than equal to 768 i.e lesser than equal to average touch devices (if block for touch devices)
    // Also element should not contain the below mentioned classes.
    if(window.innerWidth <= 768 && (!element.classList.contains('play') && !element.classList.contains('pause') && !element.classList.contains('rewind') && !element.classList.contains('timeline'))) {
        // Making touch devices control container visible
        touchDevicesControlsContainer.classList.toggle('flex');

        // Autohiding the touchDevicesControlsContainer after 2500ms
        autoHideControlsContainer(2500); 
    }
};

// Arrow Function to pause the video
const pauseVideoPlayer = (e) => {
    videoPlayer.pause();

    // Removing paused class to make play button visible.
    touchDevicesButtonsContainer.classList.remove('paused');
    
    // Autohiding the touchDevicesControlsContainer after 2500ms 
    autoHideControlsContainer(2500);
};

// Arrow Function to play the video
const playVideoPlayer = (e) => {
    videoPlayer.play();

    // Adding paused class to make play button hidden.
    touchDevicesButtonsContainer.classList.add('paused');

    // Autohiding the touchDevicesControlsContainer after 2500ms 
    autoHideControlsContainer(2500);
};

// Adding Click Event to play button
touchPlay.addEventListener('click', playVideoPlayer);

// Adding Click Event to pause button
touchPause.addEventListener('click', pauseVideoPlayer);

// Adding Click Event to Video Container
videoContainer.addEventListener('click', controlVideoPlayer);

// Adding Click Event to rewind button
touchRewind.addEventListener('click', rewindVideoPlayer);

// Adding Click Event to fast forward button
touchFastForward.addEventListener('click', fastForwardVideoPlayer);

// Adding event to window when orientation is changed.
window.addEventListener('orientationchange', (e) => {
  
    // Getting Orientation Object from orintation property in screen object. 
    const orientationObj = screen.orientation;

    // If the orientation has changed to landscape i.e angle 90 || -90deg then display a message and hide all other contents. 
    if(orientationObj.angle === 90 || orientationObj.angle === -90) {
        document.querySelector('.landscape_orientation').style.display = "block";
        videoContainer.style.display = "none";
        videoPlayer.pause();
        touchDevicesControlsContainer.classList.remove('paused');
    }
    // Else orientation has changed to potrait then hide the message and display all other contents. 
    else {
        document.querySelector('.landscape_orientation').style.display = "none";
        videoContainer.style.display = "block";
    }
});
/* ------------------------------------------------- || Touch Devices || ------------------------------------------------------*/
