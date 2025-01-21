/*=============================================================================
  Preloader Logic
=============================================================================*/
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Hide immediately once the page is loaded
    preloader.style.display = "none";
  }

  // Fallback to hide preloader after 5 seconds, just in case
  setTimeout(() => {
    if (preloader) {
      preloader.style.display = "none";
    }
  }, 5000);
});

/*=============================================================================
  Main Script (Runs on DOMContentLoaded)
=============================================================================*/
document.addEventListener("DOMContentLoaded", () => {
  /*---------------------------------------------------------------------------
    1. Mobile Navigation Toggle with Outside Click Support
  ---------------------------------------------------------------------------*/
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    // Toggle .active when clicking the hamburger button
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close the menu when clicking outside of it
    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !navToggle.contains(event.target) &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
      }
    });
  } else {
    console.error("Navigation elements (navToggle or navLinks) not found in the DOM.");
  }

  /*---------------------------------------------------------------------------
    2. Dropdown Toggle Functionality for Important Links
  ---------------------------------------------------------------------------*/
  function toggleDropdown(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === "none" || section.style.display === "") {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  }

  // Attach click listeners to dropdown headings
  document.querySelectorAll(".important-links h2, .important-links h3").forEach((heading) => {
    heading.addEventListener("click", () => {
      const targetId = heading.nextElementSibling.id;
      toggleDropdown(targetId);
    });
  });

});

  /*---------------------------------------------------------------------------
    2. Smooth Scrolling for Anchor Links
  ---------------------------------------------------------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      const targetElement = document.querySelector(anchor.getAttribute("href"));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /*---------------------------------------------------------------------------
    3. Filter Knowledge Grid (If Filter Buttons Are Present)
  ---------------------------------------------------------------------------*/
  const knowledgeCards = document.querySelectorAll(".knowledge-card");
  const filterButtons = document.querySelectorAll(".filter-buttons button");

  if (filterButtons.length && knowledgeCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        knowledgeCards.forEach((card) => {
          card.style.display =
            category === "all" || card.dataset.category === category
              ? "block"
              : "none";
        });

        // (Optional) Highlight the active button
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  /*---------------------------------------------------------------------------
    4. Highlight Selected Card on Click
  ---------------------------------------------------------------------------*/
  knowledgeCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Remove highlight from all
      knowledgeCards.forEach((c) => c.classList.remove("highlight"));
      // Highlight the clicked card
      card.classList.add("highlight");
    });
  });

  /*---------------------------------------------------------------------------
    5. Lazy Loading Dynamic Previews using IntersectionObserver
  ---------------------------------------------------------------------------*/
  const previewImages = document.querySelectorAll(".dynamic-preview");

  if ("IntersectionObserver" in window) {
    // IntersectionObserver supported
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const card = img.closest(".knowledge-card");
            // If a data-url is not defined, fallback to the first link in the card
            const link = img.dataset.url || card?.querySelector("a")?.href;

            if (link) {
              img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
              img.onerror = () => {
                img.src = "images/fallback.jpg";
              };
            }

            // Stop observing once loaded
            obs.unobserve(img);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the image is visible
    );

    // Observe each preview image
    previewImages.forEach((img) => observer.observe(img));
  } else {
    // Fallback for older browsers without IntersectionObserver
    previewImages.forEach((img, index) => {
      const card = img.closest(".knowledge-card");
      const link = img.dataset.url || card?.querySelector("a")?.href;

      if (link) {
        // Stagger loading slightly to avoid too many simultaneous requests
        setTimeout(() => {
          img.src = `https://api.microlink.io/?url=${link}&screenshot=true&embed=screenshot.url`;
          img.onerror = () => {
            img.src = "images/fallback.jpg";
          };
        }, index * 50);
      }
    });
  }

  /*---------------------------------------------------------------------------
    6. Tap-to-Flip on Knowledge Cards (Removes Hover-Based Flips)
       - Click once to flip, click/tap outside to flip back.
  ---------------------------------------------------------------------------*/
  knowledgeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const cardInner = card.querySelector(".knowledge-card-inner");
      if (cardInner) {
        cardInner.classList.toggle("flipped");
      }
    });
  });

  // Close flipped cards when tapping/clicking outside
  document.addEventListener("click", (event) => {
    knowledgeCards.forEach((card) => {
      const cardInner = card.querySelector(".knowledge-card-inner");
      if (cardInner && cardInner.classList.contains("flipped")) {
        // If user clicks outside this specific card, remove flipped
        if (!card.contains(event.target)) {
          cardInner.classList.remove("flipped");
        }
      }
    });
  });

  /*---------------------------------------------------------------------------
    7. Initialize the Map with Custom Tiles (If Leaflet Is Loaded)
  ---------------------------------------------------------------------------*/
  if (typeof L !== "undefined" && document.getElementById("map")) {
    const map = L.map("map").setView([26.4615, -80.0728], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
        + " contributors &copy; <a href='https://carto.com/'>CARTO</a>",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: "images/custom-marker.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    // Example marker + popup
    L.marker([26.4615, -80.0728], { icon: customIcon })
      .addTo(map)
      .bindPopup("<b>Community Event:</b> Beach Cleanup<br><b>Date:</b> Jan 15, 10 AM")
      .openPopup();

    // Adjust zoom controls
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Ensure map responsiveness on window resize
    window.addEventListener("resize", () => {
      map.invalidateSize();
    });
  }
});
