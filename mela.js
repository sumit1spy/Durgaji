// Mobile navigation toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.innerHTML = isOpen ? "&times;" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
        });
    });
}

// Ride Filters (All / High Thrill / Family / Kids)
const filterPills = document.querySelectorAll(".filter-pill");
const rideCards = document.querySelectorAll(".ride-card");

filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
        // Toggle active button
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const filterValue = pill.dataset.filter;

        rideCards.forEach((card) => {
            const categories = card.dataset.category || "";
            if (filterValue === "all" || categories.includes(filterValue)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});