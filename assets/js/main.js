/* Page interactions: preloader, nav, GSAP scroll animations, counters, card tilt. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Nav ---------- */
  const nav = $("#nav"), toggle = $("#navToggle"), menu = $("#navMenu");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // highlight the link of the section in view
  const links = $$(".nav__menu a:not(.btn)");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => spy.observe(s));

  /* ---------- Card tilt + spotlight ---------- */
  if (!reduced && matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform = `rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  const showFinal = () => counters.forEach((el) => (el.textContent = el.dataset.count));

  /* ---------- Preloader → intro ---------- */
  const preloader = $("#preloader");
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    preloader.classList.add("is-done");
    if (!hasGsap || reduced) return showFinal();
    intro();
  };
  addEventListener("load", () => setTimeout(start, 400));
  setTimeout(start, 4000); // never block the page if an asset hangs

  if (!hasGsap || reduced) return;
  gsap.registerPlugin(ScrollTrigger);

  function intro() {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero__logo", { scale: 0.6, opacity: 0, y: 40, duration: 1.1, ease: "back.out(1.6)" })
      .from(".hero__eyebrow", { opacity: 0, letterSpacing: "1em", duration: 0.8 }, "-=0.5")
      .from(".hero__title .line", { yPercent: 100, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.5")
      .from(".hero__sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(".hero__cta .btn", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, "-=0.3")
      .from(".phalanx", { yPercent: 60, opacity: 0, duration: 1.2 }, 0.3)
      .from(".nav", { yPercent: -100, opacity: 0, duration: 0.6 }, 0.2);
  }

  // hero parallax on scroll
  gsap.to(".hero__content", { yPercent: 25, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__helmet", { yPercent: -30, rotate: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // generic reveal
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 50, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });

  // program cards: staggered rise
  gsap.from(".card", {
    opacity: 0, y: 60, rotateX: -15, stagger: 0.1, duration: 0.8, ease: "power3.out", clearProps: "transform",
    scrollTrigger: { trigger: ".cards", start: "top 80%" },
  });

  // counters
  counters.forEach((el) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: +el.dataset.count, duration: 2, ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
})();
