const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Mobile navigation
if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.innerHTML = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
        });
    });
}

// Google Maps links aur photo load fallbacks
const cards = document.querySelectorAll(".location-card");

cards.forEach((card) => {
    const location = card.dataset.location;
    const mapLink = card.querySelector(".map-link");
    const image = card.querySelector("img");

    if (mapLink && location) {
        mapLink.href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(location);
    }

    if (image) {
        // Photo load hone par container ko has-image class dega
        image.addEventListener("load", () => {
            const photoContainer = card.querySelector(".location-photo");
            if (photoContainer) {
                photoContainer.classList.add("has-image");
            }
        });

        image.addEventListener("error", () => {
            image.style.display = "none";
        });
    }
});