const header = document.querySelector(".site-header");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetHomeScroll() {
  const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
  const openedDirectly = document.referrer === "";

  if (isHomePage && window.location.hash && openedDirectly) {
    history.replaceState(null, "", window.location.pathname);
  }

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
}

resetHomeScroll();
window.addEventListener("DOMContentLoaded", resetHomeScroll);
window.addEventListener("load", () => {
  resetHomeScroll();
  window.setTimeout(resetHomeScroll, 50);
  window.setTimeout(resetHomeScroll, 250);
});
window.addEventListener("pageshow", resetHomeScroll);

window.addEventListener("scroll", () => {
  header.toggleAttribute("data-scrolled", window.scrollY > 16);
});

const track = document.querySelector(".project-track");
const slides = Array.from(document.querySelectorAll(".project-card"));
const previousButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const toggleButton = document.querySelector("[data-carousel-toggle]");
const carousel = document.querySelector(".project-carousel");
const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let autoplayTimer;
let isPaused = reduceMotion.matches;

function showSlide(index) {
  if (!track || slides.length === 0) return;

  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlide;
    slide.toggleAttribute("aria-hidden", !isActive);
    slide.querySelectorAll("a, button").forEach((element) => {
      element.tabIndex = isActive ? 0 : -1;
    });
  });

  dots.forEach((dot, dotIndex) => {
    dot.setAttribute("aria-current", String(dotIndex === currentSlide));
  });
}

function startAutoplay() {
  if (isPaused || reduceMotion.matches || slides.length < 2) return;
  stopAutoplay();
  autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), 6500);
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
}

function setPaused(paused) {
  isPaused = paused;
  toggleButton?.setAttribute("aria-pressed", String(paused));
  if (toggleButton) {
    toggleButton.textContent = paused ? "Play carousel" : "Pause carousel";
  }
  carousel?.setAttribute("aria-live", paused ? "polite" : "off");

  if (paused) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

function moveCarousel(index) {
  showSlide(index);
  if (!isPaused) startAutoplay();
}

previousButton?.addEventListener("click", () => moveCarousel(currentSlide - 1));
nextButton?.addEventListener("click", () => moveCarousel(currentSlide + 1));
dots.forEach((dot) => {
  dot.addEventListener("click", () => moveCarousel(Number(dot.dataset.carouselDot)));
});

toggleButton?.addEventListener("click", () => setPaused(!isPaused));
carousel?.addEventListener("mouseenter", stopAutoplay);
carousel?.addEventListener("mouseleave", startAutoplay);
carousel?.addEventListener("focusin", stopAutoplay);
carousel?.addEventListener("focusout", startAutoplay);
reduceMotion.addEventListener("change", () => setPaused(reduceMotion.matches));

showSlide(0);
setPaused(isPaused);
