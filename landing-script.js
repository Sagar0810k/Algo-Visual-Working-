document.addEventListener("DOMContentLoaded", () => {
  // Import AOS and anime libraries
  const AOS = window.AOS
  const anime = window.anime

  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
  })

  // Get DOM elements
  const startSortingBtn = document.getElementById("start-sorting-btn")
  const startSortingBtnBottom = document.getElementById("start-sorting-btn-bottom")
  const barsContainer = document.querySelector(".bars-container")

  // Redirect to sorting visualizer
  startSortingBtn.addEventListener("click", () => {
    window.location.href = "index.html"
  })

  startSortingBtnBottom.addEventListener("click", () => {
    window.location.href = "index.html"
  })

  // Generate random bars for the hero section
  function generateBars() {
    barsContainer.innerHTML = ""
    const numBars = 15

    // Create bars with random heights
    for (let i = 0; i < numBars; i++) {
      const height = Math.floor(Math.random() * 200) + 50
      const bar = document.createElement("div")
      bar.className = "bar"
      bar.style.height = `${height}px`
      barsContainer.appendChild(bar)
    }
  }

  // Initial bars generation
  generateBars()

  // Animate the bars
  function animateBars() {
    anime({
      targets: ".bar",
      height: () => anime.random(50, 250),
      duration: 1500,
      delay: anime.stagger(100),
      easing: "easeInOutQuad",
      complete: () => {
        setTimeout(animateBars, 2000)
      },
    })
  }

  // Start the animation
  setTimeout(animateBars, 1000)

  // Hero section animation
  anime({
    targets: ".hero-text h1, .hero-text p, .hero-text button",
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(200),
    duration: 1000,
    easing: "easeOutQuad",
  })

  // Navbar animation
  anime({
    targets: ".navbar",
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
    easing: "easeOutQuad",
  })

  // Parallax effect on scroll
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY

    // Parallax for hero section
    if (scrollPosition < window.innerHeight) {
      document.querySelector(".hero").style.backgroundPositionY = `${scrollPosition * 0.5}px`
    }
  })

  // Animate algorithm cards on hover
  const algorithmCards = document.querySelectorAll(".algorithm-card")

  algorithmCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      anime({
        targets: this,
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        duration: 300,
        easing: "easeOutQuad",
      })
    })

    card.addEventListener("mouseleave", function () {
      anime({
        targets: this,
        scale: 1,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        duration: 300,
        easing: "easeOutQuad",
      })
    })
  })
})
