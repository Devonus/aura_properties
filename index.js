const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  // Toggle button content: hamburger <-> X
  if (navLinks.classList.contains("open")) {
    navToggle.textContent = "×"; // X symbol
  } else {
    navToggle.textContent = "☰"; // Hamburger symbol
  }
});

function adjustBodyPadding() {
  const navbar = document.querySelector(".navbar");
  const navHeight = navbar.offsetHeight;
  document.body.style.paddingTop = navHeight + "px";
}

// Run on load and on resize
window.addEventListener("load", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);

let properties = [];

fetch("/properties.json")
  .then((res) => res.json())
  .then((data) => {
    properties = data;
  });

const input = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

const houseImages = [
  "public/house1.png",
  "public/house2.png",
  "public/house3.png",
];

input.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  if (!query) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  const matches = properties.filter((prop) => {
    return (
      prop.city.toLowerCase().includes(query) ||
      prop.neighborhood.toLowerCase().includes(query) ||
      prop.zip.includes(query)
    );
  });

  const topResults = matches.slice(0, 3);

  if (topResults.length === 0) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  // Render suggestions with images
  let html = "";
  topResults.forEach((match, i) => {
    const image = houseImages[i % houseImages.length];

    html += `
      <div class="suggestion-item">
        <img src="${image}" alt="Property image" />
        <div class="suggestion-text">
          ${match.address}<br />
          ${match.neighborhood}, ${match.city}
        </div>
      </div>
    `;
  });

  if (matches.length > 3) {
    html += `<div class="more-results">
      Click to view ${matches.length - 3} more
    </div>`;
  }

  suggestionsBox.innerHTML = html;
  suggestionsBox.classList.remove("hidden");
});

// english to spanish button
const btn = document.getElementById("langToggleBtn");
let currentLang = "en"; // Start in English

btn.addEventListener("click", () => {
  const spanishElems = document.querySelectorAll('[data-lang="es"]');
  const englishElems = document.querySelectorAll('[data-lang="en"]');

  if (currentLang === "en") {
    // Switch to Spanish
    spanishElems.forEach((el) => (el.style.display = "block"));
    englishElems.forEach((el) => (el.style.display = "none"));
    btn.textContent = "EN"; // Show EN button to switch back
    btn.setAttribute("aria-label", "Switch to English");

    // Update placeholder and button text for Spanish
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    if (searchInput) {
      searchInput.placeholder = "Buscar por ciudad, colonia o código postal...";
    }
    if (searchBtn) {
      searchBtn.textContent = "Buscar";
    }

    currentLang = "es";
    document.documentElement.lang = "es";
  } else {
    // Switch to English
    spanishElems.forEach((el) => (el.style.display = "none"));
    englishElems.forEach((el) => (el.style.display = "block"));
    btn.textContent = "ES"; // Show ES button to switch back
    btn.setAttribute("aria-label", "Switch to Spanish");

    // Update placeholder and button text for English
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    if (searchInput) {
      searchInput.placeholder = "Search by city, neighborhood, or zip...";
    }
    if (searchBtn) {
      searchBtn.textContent = "Search";
    }

    currentLang = "en";
    document.documentElement.lang = "en";
  }
});
