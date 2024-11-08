function loadComponent(url, elementId, callback) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Could not load ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        document.getElementById(elementId).innerHTML = data;
        if (callback) callback();  // Call the callback function if provided
      })
      .catch(error => console.error(error));
  }
  
  // Function to dynamically load the navbar's JavaScript file
  function loadNavbarScript() {
    const script = document.createElement("script");
  
    // Check if the current path includes "/public/" and set the script source accordingly
    if (window.location.pathname.includes("/public/")) {
      script.src = "../nav.js";
    } else {
      script.src = "nav.js";
    }
  
    script.defer = true;
    document.head.appendChild(script);
  }
  
  // Function to adjust navigation links based on data-path
function adjustNavLinks() {
  const pathPrefix = window.location.pathname.includes("/public/") ? "../public/" : "";
  
  document.querySelectorAll("#mainNav a[data-path]").forEach(link => {
    const path = link.getAttribute("data-path");
    link.href = pathPrefix + path;
  });
}

  // Load navbar and footer with their specific paths
  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
  
    if (path.includes("/public/")) {
      loadComponent("../components/nav.html", "navbar", loadNavbarScript);  // Load navbar and script
      loadComponent("../components/footer.html", "footer");
    } else {
      loadComponent("components/nav.html", "navbar", loadNavbarScript);     // Load navbar and script
      loadComponent("components/footer.html", "footer");
    }
  });
  