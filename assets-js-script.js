// Preloader Logic
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) preloader.style.display = "none";
});

// Mobile Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Filter Knowledge Grid
const knowledgeCards = document.querySelectorAll(".knowledge-card");
const filterButtons = document.querySelectorAll(".filter-buttons button");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        knowledgeCards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
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

// Add Highlight Effect CSS Dynamically
document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
        .knowledge-card.highlight {
            border-color: #ff9c3c;
            box-shadow: 0 0 15px rgba(255, 156, 60, 0.6);
            transform: scale(1.05);
        }
    </style>`
);

// Dynamic Previews for Knowledge Grid
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".dynamic-preview").forEach(img => {
        const card = img.closest(".knowledge-card");
        const link = card.querySelector("a").href;
        img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
        img.onerror = () => { img.src = "assets/images/fallback.jpg"; }; // Fallback image in case of errors
    });
});

// Map Initialization
const map = L.map('map').setView([26.4615, -80.0728], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.marker([26.4615, -80.0728]).addTo(map)
    .bindPopup('Community Event: Beach Cleanup<br>Jan 15, 10 AM')
    .openPopup();
