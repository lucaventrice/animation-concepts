window.onload = () => {
  gsap.set("#rangeOnScroll", {
    width: "100%",
    height: gsap.getProperty("#gallery", "height"),
    onComplete: () => {
      gsap.set("#gallery, #images", {
        height: "100%",
        width: "100%",
        opacity: 1,
        position: "fixed",
        top: 0,
        left: 0,
        perspective: 300,
      });
    },
  });

  gsap.set("#gallery img", {
    position: "absolute",
    attr: {
      // loop with iterator, target, array
      // get context outside of one item
      id: (i, t, a) => {
        initImg(i, t);
        return "img" + i;
      },
    },
  });

  gsap
    .timeline({
      defaults: {
        duration: 1,
      },
      // close the detail view when scrolling
      onUpdate: () => {
        if (gsap.getProperty("#cursorClose", "opacity") == 1) closeDetail();
      },
      scrollTrigger: {
        trigger: "#rangeOnScroll",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    .fromTo(
      "#title-start",
      { scale: 0.6, transformOrigin: "50%" },
      { scale: 2 },
      0
    )
    .to(
      "#title-start path",
      {
        duration: 0.3,
        drawSVG: 0,
        stagger: 0.05,
        ease: "power1.in",
      },
      0
    )
    .fromTo(
      ".imgContainer",
      { z: -5000 },
      { z: 350, ease: "none", stagger: -0.3 },
      0.3
    )
    .fromTo(
      ".imgContainer img",
      { scale: 3 },
      { scale: 1.15, ease: "none", stagger: -0.3 },
      0.3
    )
    .to(
      ".imgContainer",
      { duration: 0, pointerEvents: "auto", stagger: -0.3 },
      0.5
    )
    .from(
      ".imgContainer img",
      {
        duration: 0.3,
        opacity: 0,
        stagger: -0.3,
        ease: "power1.inOut",
      },
      0.3
    )
    .to(
      ".imgContainer img",
      {
        duration: 0.1,
        opacity: 0,
        stagger: -0.3,
        ease: "expo.inOut",
      },
      1.2
    )
    .to(
      ".imgContainer",
      { duration: 0, pointerEvents: "none", stagger: -0.3 },
      1.27
    )
    .add("end")
    .fromTo(
      "#title-end",
      { scale: 0.1, transformOrigin: "50%" },
      { scale: 0.6, ease: "power3" },
      "end-=0.2"
    )
    .from(
      "#title-end path",
      {
        duration: 0.4,
        drawSVG: 0,
        stagger: 0.15,
        ease: "sine.inOut",
      },
      "end-=0.2"
    );

  // create a wrapper container for every image
  // append target image to the container
  // append the container to images
  function initImg(i, t) {
    const container = document.createElement("div");
    const images = document.querySelector("#images");
    container.appendChild(t);
    images.appendChild(container);
    gsap.set(container, {
      pointerEvents: "none",
      position: "absolute",
      attr: {
        id: "container" + i,
        class: "imgContainer",
      },
      width: t.width,
      height: t.height,
      overflow: "hidden",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      x: t.dataset.x,
      y: t.dataset.y,
      perspective: 500,
    });

    t.onmouseover = () =>
      gsap.to("#cursorCircle", {
        duration: 0.2,
        attr: { r: 30, "stroke-width": 4 },
      });

    t.onmousedown = () => {
      gsap.to(t, { z: -25, ease: "power2" });
      gsap.to("#cursorCircle", { attr: { r: 40 }, ease: "power3" });
    };

    t.onmouseup = () => gsap.to(t, { z: 0, ease: "power1.inOut" });

    t.onmouseout = () =>
      gsap.to("#cursorCircle", {
        duration: 0.2,
        attr: { r: 11, "stroke-width": 3 },
      });

    t.onclick = () => showDetail(t);
  }

  function showDetail(t) {
    gsap
      .timeline()
      .set("#detailTxt", { textContent: t.alt }, 0)
      .set(
        "#detailImg",
        { background: "url(" + t.src + ") center no-repeat"},
        0
      )
      .fromTo("#detail", { top: "100%" }, { top: 0, ease: "expo.inOut" }, 0)
      .fromTo(
        "#detailImg",
        { y: "100%" },
        { y: "0%", ease: "expo", duration: 0.7 },
        0.2
      )
      .fromTo(
        "#detailTxt",
        { opacity: 0 },
        { opacity: 1, ease: "power2.inOut" },
        0.4
      )
      .to("#cursorCircle", { duration: 0.2, opacity: 0 }, 0.2)
      .to("#cursorClose", { duration: 0.2, opacity: 1 }, 0.4);
  }

  function closeDetail() {
    gsap
      .timeline()
      .to("#detailTxt", { duration: 0.3, opacity: 0 }, 0)
      .to("#detailImg", { duration: 0.3, y: "-100%", ease: "power1.in" }, 0)
      .to("#detail", { duration: 0.3, top: "-100%", ease: "expo.in" }, 0.1)
      .to("#cursorClose", { duration: 0.1, opacity: 0 }, 0)
      .to("#cursorCircle", { duration: 0.2, opacity: 1 }, 0.1);
  }
  document.getElementById("detail").onclick = closeDetail;
};

if (ScrollTrigger.isTouch === 1) {
  gsap.set("#cursor", { opacity: 0 });
  gsap.set(".imgContainer", { x: 0, y: 0 });
} else {
  window.addEventListener("mousemove", (e) => {
    gsap.to(".imgContainer", {
      // move imgContainer relative to cursor position
      xPercent: (-e.clientX / innerWidth) * 100,
      yPercent: -25 - (e.clientY / innerHeight) * 50,
      rotateX: 8 - (e.clientY / innerHeight) * 16,
      rotateY: -8 + (e.clientX / innerWidth) * 16,
    });
    // move image inside imgContainer
    gsap.to(".imgContainer img", {
      xPercent: (-e.clientX / innerWidth) * 10,
      yPercent: -5 - (e.clientY / innerHeight) * 10,
    });
    // circle on cursor position
    gsap.to("#cursor", { duration: 0.25, x: e.clientX, y: e.clientY });
  });
}
