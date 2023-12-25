function isBackgroundColorDark(element) {
    let rgb = window.getComputedStyle(element).backgroundColor.split(/\s*,\s*/).map(x => +x.match(/\d+/g)[0]);
    let brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness < 128; 
}

function displayMessage() {
    // Remove any previous message if exists
    let oldMessage = document.getElementById('customDistractionFreeMsg');
    if (oldMessage) oldMessage.remove();

    let backgroundColorElement = document.querySelector("ytd-app");
    let isDarkMode = isBackgroundColorDark(backgroundColorElement);
    let textColor = isDarkMode ? 'white' : 'black';

    // Main message
    let message = document.createElement('div');
    message.id = 'customDistractionFreeMsg';
    message.innerHTML = "Enjoy Your Distraction Free YouTube Experience. Now No Mindless Video Consumption. Search Only What You Need to Watch.";
    message.style.fontSize = '18px';
    message.style.fontFamily = 'Roboto, Arial, sans-serif';
    message.style.textAlign = 'center';
    message.style.marginTop = '50px';
    message.style.position = 'absolute';
    message.style.top = '30%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = textColor;
    message.style.zIndex = '900';

    // Attribution and LinkedIn icon
    let attribution = document.createElement('div');
    attribution.innerHTML = `<a href="https://www.linkedin.com/in/debashishsahoo/" target="_blank">Built by Debashish</a>`;
    attribution.style.fontSize = '9px';
    attribution.style.textAlign = 'center';
    attribution.style.marginTop = '20px';
    attribution.style.color = textColor;

    // Append the message and attribution directly to the body
    document.body.appendChild(message);
    message.appendChild(attribution);
}

const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList) {
        if (mutation.target.id === "page-manager" && mutation.addedNodes.length) {
            applyChanges();
        }
    }
});

function startObserving() {
    observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserving() {
    observer.disconnect();
}

function applyChanges() {
    stopObserving();

    // Check if it's the homepage
    if (window.location.pathname === "/" && !window.location.search) {
        // Hide the sidebar
        let sidebar = document.querySelector("ytd-app #guide");
        if (sidebar) sidebar.style.display = 'none';

        // Hide the default video feed on the homepage
        let feed = document.querySelector("ytd-browse[page-subtype='home']");
        if (feed) feed.style.display = 'none';

        // Display the custom message
        displayMessage();
    } else {
        let sidebar = document.querySelector("ytd-app #guide");
        if (sidebar) sidebar.style.display = '';

        let feed = document.querySelector("ytd-browse[page-subtype='home']");
        if (feed) feed.style.display = '';

        let message = document.getElementById('customDistractionFreeMsg');
        if (message) message.remove();
    }

    // Additional check and delay for video player
    if (window.location.pathname.includes("/watch")) {
        setTimeout(() => {
            let videoSuggestions = document.querySelector("#secondary");
            if (videoSuggestions) videoSuggestions.style.display = 'none';
        }, 1000); // Wait for 1 second
    } else {
        let videoSuggestions = document.querySelector("#secondary");
        if (videoSuggestions) videoSuggestions.style.display = '';
    }

    startObserving();
}

// Initially apply the changes
applyChanges();
