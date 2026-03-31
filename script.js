(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
      });
    });
  }

  // Carousel: one image at a time, prev/next + dots
  function initCarousels() {
    var carousels = document.querySelectorAll(".hobby-gallery.carousel");
    carousels.forEach(function (carousel) {
      var viewport = carousel.querySelector(".carousel-viewport");
      var track = carousel.querySelector(".carousel-track");
      var slides = carousel.querySelectorAll(".carousel-slide");
      var prevBtn = carousel.querySelector(".carousel-btn-prev");
      var nextBtn = carousel.querySelector(".carousel-btn-next");
      var dotsEl = carousel.querySelector(".carousel-dots");
      var total = slides.length;
      if (!track || total === 0) return;

      var index = 0;
      function goTo(i) {
        index = (i + total) % total;
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dotsEl.querySelectorAll("button").forEach(function (dot, j) {
          dot.setAttribute("aria-selected", j === index ? "true" : "false");
        });
      }

      function startAuto() {
        return setInterval(function () {
          goTo(index + 1);
        }, 5000);
      }
      var autoId;

      function resetAuto() {
        if (autoId) clearInterval(autoId);
        autoId = startAuto();
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          goTo(index - 1);
          resetAuto();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          goTo(index + 1);
          resetAuto();
        });
      }

      for (var d = 0; d < total; d++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Go to slide " + (d + 1));
        btn.setAttribute("aria-selected", d === 0 ? "true" : "false");
        btn.addEventListener("click", (function (k) {
          return function () {
            goTo(k);
            resetAuto();
          };
        }(d)));
        dotsEl.appendChild(btn);
      }
      goTo(0);
      autoId = startAuto();

      carousel.addEventListener("mouseenter", function () {
        if (autoId) {
          clearInterval(autoId);
          autoId = null;
        }
      });
      carousel.addEventListener("mouseleave", function () {
        if (!autoId) {
          autoId = startAuto();
        }
      });
    });
  }
  // Scroll-triggered animations: add .animate-on-scroll to all main sections, then .is-visible when in view
  function initScrollAnimations() {
    var sections = document.querySelectorAll("main > section");
    sections.forEach(function (section) {
      section.classList.add("animate-on-scroll");
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Hero entrance: add .hero-loaded to body after first paint
  function initHeroEntrance() {
    if (document.querySelector(".hero")) {
      requestAnimationFrame(function () {
        setTimeout(function () {
          document.body.classList.add("hero-loaded");
        }, 80);
      });
    }
  }

  function init() {
    initCarousels();
    initScrollAnimations();
    initHeroEntrance();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
