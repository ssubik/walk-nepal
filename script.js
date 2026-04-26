const menuToggle = document.getElementById("menuToggle");
const primaryMenu = document.getElementById("primaryMenu");
const navLinks = primaryMenu ? primaryMenu.querySelectorAll("a") : [];
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && primaryMenu) {
  const setMenuState = (isOpen) => {
    primaryMenu.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = primaryMenu.classList.contains("open");
    setMenuState(!isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryMenu.classList.contains("open")) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const clickTarget = event.target;

    if (
      window.innerWidth < 980 &&
      primaryMenu.classList.contains("open") &&
      !primaryMenu.contains(clickTarget) &&
      !menuToggle.contains(clickTarget)
    ) {
      setMenuState(false);
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 980) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) {
      setMenuState(false);
    }
  });
}

const revealTargets = document.querySelectorAll(
  ".section:not(.hero) .section-heading, .card, .image-frame, .stats-card, .appointment-wrap, .contact-info, .map-card"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px",
    }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.classList.add(`reveal-delay-${(index % 3) + 1}`);
    observer.observe(target);
  });
} else if (!prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("show"));
}
