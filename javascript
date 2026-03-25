gsap.registerPlugin(ScrollTrigger);

gsap.to(".row-1", {
  x: -600,
  scrollTrigger: {
    trigger: ".gallery-section",
    start: "top top",
    end: "+=1200",
    scrub: true,
    pin: true
  }
});

gsap.to(".row-2", {
  x: 600,
  scrollTrigger: {
    trigger: ".gallery-section",
    start: "top top",
    end: "+=1200",
    scrub: true
  }
});
