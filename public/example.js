const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + location.host + "/bare/";

// Makes it so you can press Enter to submit instead of just pressing a button
document.getElementById("urlInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

// Search button click handler
document.getElementById("searchButton").onclick = async function (event) {
    event.preventDefault();

    let url = document.getElementById("urlInput").value; // Get the URL input
    let searchUrl = "https://www.google.com/search?q=";

    // If no periods are detected in the input, treat it as a search query
    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        // If the URL doesn't start with http:// or https://, prepend https://
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
    }

    // Initialize transport if it's not already set
    if (!await connection.getTransport()) {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    // Encode the URL and load it into the iframe
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
};

// Dropdown for switching between transport protocols (Epoxy / Bare)
document.getElementById("switcher").onselect = async function (event) {
    switch (event.target.value) {
        case "epoxy":
            // Switch to Epoxy transport
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            break;
        case "bare":
            // Switch to Bare transport
            await connection.setTransport("/baremod/index.mjs", [bareUrl]);
            break;
    }
};
