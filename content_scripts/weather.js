(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * Given a URL to a weather image, remove all existing weather, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertWeather(weatherURL) {
    removeExistingWeather();
    let weatherImage = document.createElement("img");
    weatherImage.setAttribute("src", weatherURL);
    weatherImage.style.height = "100vh";
    weatherImage.className = "weatherify-image";
    document.body.appendChild(weatherImage);
  }

  /**
   * Remove every weather from the page.
   */
  function removeExistingWeather() {
    let existingWeather = document.querySelectorAll(".weatherify-image");
    for (let weather of existingWeather) {
      weather.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "weatherify()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "weatherify") {
      insertWeather(message.weatherURL);
    } else if (message.command === "reset") {
      removeExistingWeather();
    }
  });

})();