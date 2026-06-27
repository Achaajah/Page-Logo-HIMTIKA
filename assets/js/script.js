(function ($) {
  "use strict";

  //Hide Loading Box (Preloader)
  function handlePreloader() {
    if ($(".preloader").length) {
      $("body").addClass("page-loaded");
      $(".preloader").delay(1000).fadeOut(300);
    }
  }

  //Update Header Style and Scroll to Top
  function headerStyle() {
    // if($('.main-header').length){
    // 	var windowpos = $(window).scrollTop();
    // 	var headerUpper = $('.header-upper');
    // 	var headerTop = $('.header-top');
    // 	var scrollLink = $('.scroll-to-top');

    // 	// Cek jika scroll lebih dari 100px
    // 	if (windowpos > 136) {
    // 		// Menambahkan kelas sticky pada header-upper
    // 		headerUpper.addClass('sticky');
    // 		// Menyembunyikan header-top
    // 		headerTop.fadeOut(300);
    // 		// Menampilkan scroll-to-top
    // 		scrollLink.fadeIn(1000);
    // 	} else {
    // 		// Menghapus kelas sticky pada header-upper
    // 		headerUpper.removeClass('sticky');
    // 		// Menampilkan kembali header-top
    // 		headerTop.fadeIn(300);
    // 		// Menyembunyikan scroll-to-top
    // 		scrollLink.fadeOut(300);
    // 	}
    // }
    if ($(".main-header").length) {
      var scrollY = $(window).scrollTop();
      var header = $(".main-header");
      var headerTop = $(".header-top"); // Marquee lo

      if (scrollY <= 400) {
        // STATE: ATAS (Sticky/Absolute)
        header.removeClass("header-fixed").addClass("header-absolute");
        header.css({
          transform: "translateY(0)",
          opacity: "1",
        });
        // Marquee tetap tampil di atas
        // headerTop.show();
      } else if (scrollY > 400 && scrollY <= 550) {
        // STATE: SEMBUNYI (Transisi kabur ke atas)
        header.css({
          transform: "translateY(-100px)",
          opacity: "0",
        });
      } else {
        // STATE: BAWAH (Fixed Glassy)
        header.addClass("header-fixed").removeClass("header-absolute");
        header.css({
          transform: "translateY(0)",
          opacity: "1",
        });
        // Marquee diumpetin pas lagi melayang biar ringkas
        // headerTop.hide();
      }
    }
  }

  $(window).on("scroll", function () {
    headerStyle();
  });

  headerStyle();

  $(window).on("scroll", function () {
    headerStyle();
  });

  //Submenu Dropdown Toggle
  if ($(".main-header li.dropdown ul").length) {
    $(".main-header .navigation li.dropdown").append(
      '<div class="dropdown-btn"><span class="fa fa-angle-right"></span></div>',
    );
  }

  //Mobile Nav Hide Show
  if ($(".mobile-menu").length) {
    $(".mobile-menu .menu-box").mCustomScrollbar();

    var mobileMenuContent = $(".main-header .nav-outer .main-menu").html();
    $(".mobile-menu .menu-box .menu-outer").append(mobileMenuContent);
    $(".sticky-header .main-menu").append(mobileMenuContent);

    //Dropdown Button
    $(".mobile-menu li.dropdown .dropdown-btn").on("click", function () {
      $(this).toggleClass("open");
      $(this).prev("ul").slideToggle(500);
    });
    //Menu Toggle Btn
    $(".mobile-nav-toggler").on("click", function () {
      $("body").addClass("mobile-menu-visible");
    });

    //Menu Toggle Btn
    $(".mobile-menu .menu-backdrop,.mobile-menu .close-btn").on(
      "click",
      function () {
        $("body").removeClass("mobile-menu-visible");
      },
    );
  }

  // Scroll to a Specific Div
  if ($(".scroll-to-target").length) {
    $(".scroll-to-target").on("click", function () {
      var target = $(this).attr("data-target");
      // animate
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top,
        },
        1500,
      );
    });
  }

  $(window).on("scroll", function () {
    var scrollPos = $(window).scrollTop();
    var btn = $("#backToTop");

    if (scrollPos > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });

  // Fungsi Klik: Balik ke Atas
  $("#backToTop").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      0,
    );
  });

  // Loading masuk page akan di gantikan dengan fungsi berikut

  $(window).on("load", function () {
    handlePreloader();
  });
})(window.jQuery);


/* ═══════════════════════════════════════════
   HIMTIKA-SECTION
═══════════════════════════════════════════ */
(function () {
  "use strict";

  const cards   = [...document.querySelectorAll(".card-container")];
  const btnNext = document.querySelector(".nav.next");
  const btnPrev = document.querySelector(".nav.prev");
  const dots    = [...document.querySelectorAll(".dots span")];
  const wrapper = document.querySelector(".cards-wrapper");
  const section = document.querySelector(".himtika-section");

  const TOTAL = cards.length;
  const GAP   = window.innerWidth <= 600 ? 140 : 210;

  let current           = 2;
  let isAnimating       = false;
  let isEntrancePlaying = false;

  const mod = (n, m) => ((n % m) + m) % m;

  /* ── Layout ── */
  function update() {
    cards.forEach((container, i) => {
      container.classList.remove("active", "side", "far", "hidden", "is-left", "is-right");

      let offset = i - current;
      if (offset > TOTAL / 2)  offset -= TOTAL;
      if (offset < -TOTAL / 2) offset += TOTAL;

      container.style.transform = `translate(calc(-50% + ${offset * GAP}px), -50%)`;

      if (offset === 0)                container.classList.add("active");
      else if (Math.abs(offset) === 1) container.classList.add("side");
      else if (Math.abs(offset) === 2) container.classList.add("far");
      else                             container.classList.add("hidden");

      if (offset < 0) container.classList.add("is-left");
      if (offset > 0) container.classList.add("is-right");
      if (offset !== 0) container.classList.remove("flipped");
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  /* ── Roll slide (pindah kartu) ── */
  function slide(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const outClass = direction === "next" ? "roll-out-left"  : "roll-out-right";
    const inClass  = direction === "next" ? "roll-in-right"  : "roll-in-left";
    const activeEl = cards[current];

    activeEl.classList.add(outClass);

    setTimeout(() => {
      current = direction === "next" ? mod(current + 1, TOTAL) : mod(current - 1, TOTAL);
      cards.forEach((c) => {
        c.classList.remove("roll-in-right", "roll-in-left", "roll-out-left", "roll-out-right");
      });
      update();

      const newActive = cards[current];
      newActive.classList.add(inClass);
      newActive.addEventListener("animationend", () => {
        newActive.classList.remove(inClass);
        isAnimating = false;
      }, { once: true });
    }, 380);
  }

  /* ── Klik kartu ── */
  cards.forEach((container, i) => {
    container.addEventListener("click", () => {
      if (container.classList.contains("active")) {
        container.classList.toggle("flipped");
      } else if (!isAnimating) {
        let offset = i - current;
        if (offset > TOTAL / 2)  offset -= TOTAL;
        if (offset < -TOTAL / 2) offset += TOTAL;
        slide(offset > 0 ? "next" : "prev");
      }
    });
  });

  /* ── Nav ── */
  btnNext.addEventListener("click", () => slide("next"));
  btnPrev.addEventListener("click", () => slide("prev"));

  /* ── Dots ── */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (i === current || isAnimating) return;
      let offset = i - current;
      if (offset > TOTAL / 2)  offset -= TOTAL;
      if (offset < -TOTAL / 2) offset += TOTAL;
      slide(offset > 0 ? "next" : "prev");
    });
  });

  /* ── Keyboard ── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") slide("next");
    if (e.key === "ArrowLeft")  slide("prev");
  });

  /* ── Mouse drag ── */
  let startX     = null;
  let isDragging = false;

  wrapper.addEventListener("mousedown", (e) => {
    startX     = e.clientX;
    isDragging = true;
    wrapper.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging || startX === null) return;
    isDragging = false;
    wrapper.style.cursor = "grab";
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) slide(diff < 0 ? "next" : "prev");
    startX = null;
  });

  /* ── Touch swipe ── */
  wrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) slide(diff < 0 ? "next" : "prev");
    startX = null;
  }, { passive: true });

  /* ── Scroll entrance & exit ── */
  function getOrderedByPosition() {
    return [...cards].sort((a, b) =>
      a.getBoundingClientRect().left - b.getBoundingClientRect().left
    );
  }

  function playEntrance() {
    if (isEntrancePlaying) return;
    isEntrancePlaying = true;

    const ordered = getOrderedByPosition();

    // sembunyikan semua dulu
    cards.forEach((c) => { c.style.opacity = "0"; });

    ordered.forEach((c, i) => {
      setTimeout(() => {
        c.style.opacity = "";
        c.classList.remove("exit");
        c.classList.add("entrance");
        c.addEventListener("animationend", () => {
          c.classList.remove("entrance");
          if (i === ordered.length - 1) {
            isEntrancePlaying = false;
          }
        }, { once: true });
      }, i * 150);
    });
  }

  function playExit() {
    isEntrancePlaying = false;
    const ordered = getOrderedByPosition();

    ordered.forEach((c, i) => {
      setTimeout(() => {
        c.classList.remove("entrance");
        c.classList.add("exit");
        c.addEventListener("animationend", () => {
          c.classList.remove("exit");
          c.style.opacity = "0";
        }, { once: true });
      }, i * 100);
    });
  }

  const entranceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playEntrance();
        } else {
          playExit();
        }
      });
    },
    { threshold: 0.2 }
  );

  /* ── Init ── */
  update();
  entranceObserver.observe(section);

})();
const heroLeft  = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  const elements  = [heroLeft, heroRight];

  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      const currentScrollY = window.scrollY;
      const scrollingDown  = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // Masuk viewport
          el.classList.remove('animate-out-down', 'animate-out-up');
          el.classList.add('animate-in');
        } else {
          // Keluar viewport — arah keluar sesuai scroll
          el.classList.remove('animate-in');

          if (scrollingDown) {
            // Scroll ke bawah → elemen keluar ke atas
            el.classList.add('animate-out-up');
          } else {
            // Scroll ke atas → elemen keluar ke bawah
            el.classList.add('animate-out-down');
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));

  (function () {
  "use strict";

  const section = document.querySelector(".Logo-Section");
  const logo    = section.querySelector(".Logo-Section__logo");

  if (!section) return;

  let isVisible = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            section.classList.remove("Logo-Section--hidden");
            section.classList.add("Logo-Section--visible");

            /* Reset animasi logo supaya bisa replay tiap masuk */
            logo.style.animation = "none";
            void logo.offsetWidth;
            logo.style.animation = "";
          }
        } else {
          if (isVisible) {
            isVisible = false;
            section.classList.remove("Logo-Section--visible");
            section.classList.add("Logo-Section--hidden");
            logo.style.animation = "none";
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
})();