const menuToggle = document.getElementById("menuToggle");
const primaryMenu = document.getElementById("primaryMenu");
const navLinks = primaryMenu ? primaryMenu.querySelectorAll("a") : [];
const yearNode = document.getElementById("year");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentSubmit = document.getElementById("appointmentSubmit");
const formStatus = document.getElementById("formStatus");

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
  ".section:not(.hero) .section-heading, .card, .image-frame, .stats-card, .appointment-grid, .appointment-copy, .appointment-form-card, .contact-info, .map-card"
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

if (appointmentForm && appointmentSubmit && formStatus) {
  const defaultButtonLabel = appointmentSubmit.textContent.trim();

  appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (appointmentSubmit.disabled) {
      return;
    }

    appointmentSubmit.disabled = true;
    appointmentSubmit.textContent = "Sending...";
    appointmentForm.setAttribute("aria-busy", "true");
    formStatus.textContent = "Sending your request...";
    formStatus.dataset.state = "loading";

    try {
      await fetch(appointmentForm.action, {
        method: "POST",
        body: new FormData(appointmentForm),
        mode: "no-cors",
        credentials: "omit",
      });

      appointmentForm.reset();
      formStatus.textContent = "Request sent. We’ll contact you shortly.";
      formStatus.dataset.state = "success";
    } catch (error) {
      formStatus.textContent = "We couldn't send the request right now. Please try again or use WhatsApp.";
      formStatus.dataset.state = "error";
    } finally {
      appointmentForm.removeAttribute("aria-busy");
      appointmentSubmit.disabled = false;
      appointmentSubmit.textContent = defaultButtonLabel;
    }
  });
}
