/**
 * CSS to hide everything on the page,
 * except for elements that have the "weatherify-image" class.
 */
const hidePage = `body > :not(.weatherify-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {


    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the weather URL and
     * send a "weatherify" message to the content script in the active tab.
     */
    function weatherify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = "https://dig.abclocal.go.com/wabc/weather/web7day.jpg?w=300&r=16%3A9";
        browser.tabs.sendMessage(tabs[0].id, {
          command: "weatherify",
          weatherURL: url
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("weather")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(weatherify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute weatherify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/weather.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);