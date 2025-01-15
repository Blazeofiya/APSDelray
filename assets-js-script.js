// Preloader Logic
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "none";
    }
    // Ensure preloader hides after 5 seconds regardless
    setTimeout(() => {
        if (preloader) preloader.style.display = "none";
    }, 5000);
});

// Mobile Navigation Toggle with Outside Click Support
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Close the menu when clicking outside of it
        document.addEventListener("click", (event) => {
            if (!navLinks.contains(event.target) && !navToggle.contains(event.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    } else {
        console.error("Navigation elements (navToggle or navLinks) not found in the DOM.");
    }
});

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

if (filterButtons.length && knowledgeCards.length) {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            knowledgeCards.forEach(card => {
                card.style.display = (category === "all" || card.dataset.category === category) ? "block" : "none";
            });
        });
    });
}

// Highlight Selected Card
knowledgeCards.forEach(card => {
    card.addEventListener("click", () => {
        knowledgeCards.forEach(c => c.classList.remove("highlight"));
        card.classList.add("highlight");
    });
});

// Dynamic Previews for Knowledge Grid
document.addEventListener("DOMContentLoaded", () => {
    const images = Array.from(document.querySelectorAll(".dynamic-preview"));

    if ("IntersectionObserver" in window) {
        // Create an observer instance
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const card = img.closest(".knowledge-card");
                        const link = img.dataset.url || card?.querySelector("a")?.href;

                        if (link) {
                            img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
                            img.onerror = () => { img.src = "images/fallback.jpg"; }; // Fallback image
                        }

                        observer.unobserve(img); // Stop observing once loaded
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the image is visible
        );

        // Observe each image
        images.forEach((img) => observer.observe(img));
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        images.forEach((img, index) => {
            const card = img.closest(".knowledge-card");
            const link = img.dataset.url || card?.querySelector("a")?.href;

            if (link) {
                setTimeout(() => {
                    img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
                    img.onerror = () => { img.src = "images/fallback.jpg"; }; // Fallback image
                }, index * 50); // Reduced delay to 50ms
            }
        });
    }
});

// Enable Tap-to-Flip for Knowledge Cards on Touch Devices
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".knowledge-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Toggle the 'flipped' class on tap
            card.querySelector(".knowledge-card-inner").classList.toggle("flipped");
        });
    });

    // Close flipped cards when tapping outside (optional)
    document.addEventListener("click", (event) => {
        const cards = document.querySelectorAll(".knowledge-card-inner");
        cards.forEach(card => {
            if (!card.closest(".knowledge-card").contains(event.target) && card.classList.contains("flipped")) {
                card.classList.remove("flipped");
            }
        });
    });
});

// Initialize the map with custom tiles
if (typeof L !== 'undefined' && document.getElementById("map")) {
    const map = L.map("map").setView([26.4615, -80.0728], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>",
        subdomains: "abcd",
        maxZoom: 19
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl: "images/custom-marker.png",
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    L.marker([26.4615, -80.0728], { icon: customIcon }).addTo(map)
        .bindPopup("<b>Community Event:</b> Beach Cleanup<br><b>Date:</b> Jan 15, 10 AM")
        .openPopup();

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Ensure map responsiveness
    window.addEventListener("resize", () => {
        map.invalidateSize();
    });
}
