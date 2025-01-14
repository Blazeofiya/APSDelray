// Preloader Logic
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "none";
    }
});

// Mobile Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
    
    // Close the menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            navLinks.classList.remove("show");
        }
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute("href"));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
            });
        }
    });
});

// Filter Knowledge Grid
const knowledgeCards = document.querySelectorAll(".knowledge-card");
const filterButtons = document.querySelectorAll(".filter-buttons button");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        knowledgeCards.forEach(card => {
            card.style.display = (category === "all" || card.dataset.category === category) ? "block" : "none";
        });
    });
});

// Highlight Selected Card
knowledgeCards.forEach(card => {
    card.addEventListener("click", () => {
        knowledgeCards.forEach(c => c.classList.remove("highlight"));
        card.classList.add("highlight");
    });
});

// Dynamic Previews for Knowledge Grid
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".dynamic-preview").forEach(img => {
        const card = img.closest(".knowledge-card");
        const link = card?.querySelector("a")?.href;
        if (link) {
            img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
            img.onerror = () => { img.src = "images/fallback.jpg"; }; // Fallback image in case of errors
        }
    });
});

// Initialize the map with custom tiles
if (typeof L !== 'undefined' && document.getElementById("map")) {
    const map = L.map('map').setView([26.4615, -80.0728], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.icon({
        iconUrl: 'images/custom-marker.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    // Add marker with custom icon
    L.marker([26.4615, -80.0728], { icon: customIcon }).addTo(map)
        .bindPopup('<b>Community Event:</b> Beach Cleanup<br><b>Date:</b> Jan 15, 10 AM')
        .openPopup();

    // Custom zoom control position
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
}
