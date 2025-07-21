// Main JavaScript functionality for SAIT Waste Management site

document.addEventListener("DOMContentLoaded", () => {
  initializeGridItems()
  initializeSmoothScrolling()
  initializeAnimations()
  initializeMobileMenu()
  initializeHeaderDropdowns()
  initializeHeaderSearch()
})

// Grid item interactions
function initializeGridItems() {
  const gridItems = document.querySelectorAll(".grid-item")

  gridItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      const tooltip = this.getAttribute("data-tooltip")
      if (tooltip) {
        showModal("Waste Item Information", tooltip)
      }
    })

    item.setAttribute("tabindex", "0")
    item.setAttribute("role", "button")

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })

    item.style.animationDelay = `${index * 0.1}s`
  })
}

// Smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.getElementById(this.getAttribute("href").slice(1))
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
  })
}

// Intersection Observer for animations
function initializeAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
        if (entry.target.classList.contains("sorting-section")) {
          const gridItems = entry.target.querySelectorAll(".grid-item")
          gridItems.forEach((item, index) => {
            setTimeout(() => item.classList.add("slide-up"), index * 100)
          })
        }
      }
    })
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

  document.querySelectorAll(".hero-section, .sorting-section, .oscar-section, .circular-economy, .campus-project")
    .forEach(section => observer.observe(section))
}

// Mobile menu functionality
function initializeMobileMenu() {
  const header = document.querySelector(".header")
  const mainNav = document.querySelector(".main-nav")

  const mobileMenuBtn = document.createElement("button")
  mobileMenuBtn.className = "mobile-menu-btn"
  mobileMenuBtn.innerHTML = "☰"
  mobileMenuBtn.setAttribute("aria-label", "Toggle mobile menu")

  const headerActions = document.querySelector(".header-actions")
  if (headerActions) headerActions.insertBefore(mobileMenuBtn, headerActions.firstChild)

  const style = document.createElement("style")
  style.textContent = `
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      color: #333;
    }
    @media (max-width: 768px) {
      .mobile-menu-btn { display: block; }
      .main-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #a94442;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        flex-direction: column;
        align-items: stretch;
      }
      .main-nav.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      .main-nav .nav-item {
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      .main-nav .nav-link {
        padding: 1rem;
        text-align: center;
      }
    }
  `
  document.head.appendChild(style)

  mobileMenuBtn.addEventListener("click", function () {
    mainNav.classList.toggle("active")
    this.innerHTML = mainNav.classList.contains("active") ? "✕" : "☰"
  })

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target) && mainNav.classList.contains("active")) {
      mainNav.classList.remove("active")
      mobileMenuBtn.innerHTML = "☰"
    }
  })
}

// Header dropdowns
function initializeHeaderDropdowns() {
  const dropdownItems = document.querySelectorAll(".dropdown")
  dropdownItems.forEach(item => {
    const link = item.querySelector(".nav-link")
    link.addEventListener("click", (e) => {
      e.preventDefault()
      dropdownItems.forEach(other => other !== item && other.classList.remove("active"))
      item.classList.toggle("active")
    })
  })

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdownItems.forEach(item => item.classList.remove("active"))
    }
  })
}

// Header search
function initializeHeaderSearch() {
  const searchInput = document.querySelector(".search-input")
  const searchIcon = document.querySelector(".search-icon")

  if (searchInput && searchIcon) {
    searchIcon.addEventListener("click", () => performSearch(searchInput.value.trim()))
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") performSearch(searchInput.value.trim())
    })
  }
}

// Modal logic
function showModal(title, content) {
  let modal = document.getElementById("dynamic-modal")
  if (!modal) modal = createModal()

  modal.querySelector(".modal-title").textContent = title
  modal.querySelector(".modal-body").innerHTML = `<p>${content}</p>`
  modal.parentElement.classList.add("active")
  modal.querySelector(".modal-close").focus()
}

function createModal() {
  const overlay = document.createElement("div")
  overlay.className = "modal-overlay"
  overlay.id = "modal-overlay"
  overlay.innerHTML = `
    <div class="modal" id="dynamic-modal">
      <div class="modal-header">
        <h3 class="modal-title"></h3>
        <button class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body"></div>
    </div>
  `
  document.body.appendChild(overlay)
  overlay.querySelector(".modal-close").addEventListener("click", closeModal)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) closeModal()
  })
  return overlay.querySelector(".modal")
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay")
  if (overlay) overlay.classList.remove("active")
}

function showSearchModal() {
  showModal("Search", `
    <div class="form-group">
      <label class="form-label" for="modal-search-input">Search the site:</label>
      <input type="text" id="modal-search-input" class="form-input" placeholder="Enter your search terms...">
    </div>
    <div class="form-group">
      <button class="cta-button" onclick="performModalSearch()">Search</button>
    </div>
  `)
  setTimeout(() => {
    const input = document.getElementById("modal-search-input")
    if (input) {
      input.focus()
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performModalSearch()
      })
    }
  }, 100)
}

function performModalSearch() {
  const input = document.getElementById("modal-search-input")
  performSearch(input ? input.value.trim() : "")
}

function performSearch(query) {
  if (!query) return
  const results = searchContent(query)
  const resultsHtml = results.length
    ? `<h4>Search Results for "${query}":</h4><ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>`
    : `<p>No results found for "${query}". Try different keywords.</p>`
  showModal("Search Results", resultsHtml)
}

function searchContent(query) {
  const content = [
    "Waste Diversion and the Circular Economy",
    "Waste Sorting Guide",
    "OSCAR Sorting System",
    "Moving Towards a Circular Economy",
    "Taylor Family Campus Centre redevelopment project",
    "Sustainability initiatives",
    "Recycling programs",
    "Compost and organic waste",
    "Mixed recycling containers",
    "Beverage containers",
    "Programs and Courses",
    "Admissions",
    "Tuition and Financial Aid",
    "International",
    "Student Life",
    "About SAIT",
    "Alumni",
    "Donors",
    "Employers and Industry",
    "Teachers and Counsellors",
    "Parents and Supporters",
  ]
  return content.filter(item => item.toLowerCase().includes(query.toLowerCase()))
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

window.addEventListener("resize", debounce(() => {
  console.log("Window resized")
}, 250))

// Accessibility improvements
function improveAccessibility() {
  const skipLink = document.createElement("a")
  skipLink.href = "#main"
  skipLink.textContent = "Skip to main content"
  skipLink.className = "skip-link"
  skipLink.style.cssText = `
    position: absolute; top: -40px; left: 6px; background: #000;
    color: #fff; padding: 8px; text-decoration: none;
    z-index: 1000; transition: top 0.3s;
  `
  skipLink.addEventListener("focus", () => skipLink.style.top = "6px")
  skipLink.addEventListener("blur", () => skipLink.style.top = "-40px")
  document.body.insertBefore(skipLink, document.body.firstChild)

  const main = document.querySelector(".main")
  if (main) {
    main.id = "main"
    main.setAttribute("role", "main")
  }
}
improveAccessibility()

// Export
window.SaitWasteManagement = {
  showModal,
  closeModal,
  performSearch,
  initializeGridItems,
  showSearchModal,
}
