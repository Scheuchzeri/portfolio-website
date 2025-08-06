// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const openingScreen = document.getElementById("openingScreen");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navSidebar = document.getElementById("navSidebar");
  const mainContent = document.getElementById("mainContent");
  const navLinks = document.querySelectorAll("[data-section]");
  const sections = document.querySelectorAll(".section-container");

  let currentSection = "main";
  let sidebarOpen = false;

  // Opening Screen Fade-out Functionality
  function hideOpeningScreen() {
    openingScreen.classList.add("hidden");
    // Remove from DOM after animation completes
    setTimeout(() => {
      openingScreen.style.display = "none";
    }, 800);
  }

  // Click anywhere on opening screen to dismiss
  openingScreen.addEventListener("click", hideOpeningScreen);

  // Auto-hide opening screen after 3 seconds (optional)
  // setTimeout(hideOpeningScreen, 3000);

  // Hamburger Menu Toggle Functionality
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
      navSidebar.classList.add("active");
      hamburgerBtn.setAttribute("aria-expanded", "true");
    } else {
      navSidebar.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  }

  // Hamburger menu click handler
  hamburgerBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", function (e) {
    if (
      sidebarOpen &&
      !navSidebar.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      toggleSidebar();
    }
  });

  // Prevent sidebar from closing when clicking inside it
  navSidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Tab Switching Logic
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach((section) => {
      section.style.display = "none";
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = "block";
      currentSection = sectionId;

      // Update active nav link
      updateActiveNavLink(sectionId);

      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        toggleSidebar();
      }

      // Scroll to top of new section
      mainContent.scrollTop = 0;
    }
  }

  // Update active navigation link styling
  function updateActiveNavLink(activeSection) {
    navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === activeSection) {
        link.style.fontWeight = "bold";
        link.style.opacity = "1";
      } else {
        link.style.fontWeight = "normal";
        link.style.opacity = "0.7";
      }
    });
  }

  // Navigation link click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);
    });
  });

  // Excerpt Modal Functionality (for writing samples)
  function openExcerpt(excerptId) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "excerpt-modal";
    modal.innerHTML = `
            <div class="excerpt-modal-content">
                <button class="excerpt-close" aria-label="Close excerpt">&times;</button>
                <div class="excerpt-text">
                    ${getExcerptContent(excerptId)}
                </div>
            </div>
        `;

    // Add modal styles
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            padding: 1rem;
        `;

    // Style modal content
    const modalContent = modal.querySelector(".excerpt-modal-content");
    modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;

    // Style close button
    const closeBtn = modal.querySelector(".excerpt-close");
    closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;

    // Add to DOM
    document.body.appendChild(modal);

    // Close modal functionality
    function closeModal() {
      document.body.removeChild(modal);
    }

    // Close button click
    closeBtn.addEventListener("click", closeModal);

    // Click outside modal to close
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key to close
    const escapeHandler = function (e) {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  // Get excerpt content by ID (you'll need to populate this with your actual excerpts)
  function getExcerptContent(excerptId) {
    const excerpts = {
      excerpt1: `
                <h3>Sample Excerpt Title</h3>
                <p><em>Genre: Fiction | Date: 2024</em></p>
                <p>This is where your actual excerpt content would go. Replace this with your real writing samples...</p>
                <p>You can include multiple paragraphs, dialogue, or whatever format your writing takes.</p>
            `,
      excerpt2: `
                <h3>Another Sample</h3>
                <p><em>Genre: Essay | Date: 2023</em></p>
                <p>Another example excerpt would go here...</p>
            `,
    };

    return excerpts[excerptId] || "<p>Excerpt not found.</p>";
  }

  // Keyboard Navigation (Optional Enhancement)
  document.addEventListener("keydown", function (e) {
    // Alt + number keys to switch sections
    if (e.altKey) {
      const sectionMap = {
        1: "main",
        2: "about",
        3: "projects",
        4: "excerpts",
        5: "contact",
      };

      if (sectionMap[e.key]) {
        e.preventDefault();
        showSection(sectionMap[e.key]);
      }
    }

    // Escape key to close sidebar
    if (e.key === "Escape" && sidebarOpen) {
      toggleSidebar();
    }
  });

  // Handle browser back/forward buttons (Optional)
  window.addEventListener("popstate", function (e) {
    const section = e.state ? e.state.section : "main";
    showSection(section);
  });

  // Update browser history when navigating (Optional)
  function updateHistory(sectionId) {
    const title = `Portfolio - ${
      sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
    }`;
    history.pushState({ section: sectionId }, title, `#${sectionId}`);
  }

  // Responsive sidebar behavior
  function handleResize() {
    if (window.innerWidth > 768 && sidebarOpen) {
      // Keep sidebar open on desktop
      navSidebar.classList.add("active");
    }
  }

  window.addEventListener("resize", handleResize);

  // Initialize - set initial active nav link
  updateActiveNavLink("main");

  // Make openExcerpt function globally available
  window.openExcerpt = openExcerpt;

  console.log("Portfolio website initialized successfully!");
});

// Smooth scroll behavior for timeline (Optional enhancement)
function smoothScrollTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  }, observerOptions);

  timelineItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(item);
  });
}
