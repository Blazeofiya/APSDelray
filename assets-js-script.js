// Toggle mobile nav
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Smooth scrolling for anchor links
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

// Highlight selected card
knowledgeCards.forEach(card => {
  card.addEventListener("click", () => {
    knowledgeCards.forEach(c => c.classList.remove("highlight"));
    card.classList.add("highlight");
  });
});

// Add highlight effect CSS dynamically
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
