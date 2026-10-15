/**
 * ==============================================================================
 * JAVASCRIPT FEATURE: SMOOTH SCROLL
 * ==============================================================================
 * Implemented a custom DOM-calculated Smooth Scroll and Scroll-Spy navigation engine.
 * Rather than relying solely on passive CSS scrolling, the script intercepts internal
 * anchor events, dynamically queries the sticky header's bounding offset to prevent
 * viewport occlusion, and synchronizes active navigation states and mobile drawer ARIA
 * attributes in real time.
 * ==============================================================================
 */

// Execute once DOM content is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================================
     1. CHOSEN JAVASCRIPT FEATURE: SMOOTH SCROLL IMPLEMENTATION
     ============================================================================ */

  /**
   * Initializes smooth scrolling on all internal anchor links (href starting with '#').
   * Prevents default abrupt jumping and provides a fluid, calculated animation.
   */
  function initSmoothScroll() {
    // Select all anchor tags whose href attribute starts with '#'
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    // Select sticky header to dynamically measure its height for scroll offset
    const siteHeader = document.getElementById('siteHeader');

    internalLinks.forEach(link => {
      link.addEventListener('click', function (event) {
        // Extract the target ID from the href attribute (e.g., "#about" -> "about")
        const targetId = this.getAttribute('href');

        // Check if the link is a valid ID selector and not just an empty '#'
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);

          // If the target element exists in the DOM, perform custom smooth scroll
          if (targetElement) {
            // Prevent the browser's default sudden jump
            event.preventDefault();

            // Calculate sticky header height (default to 72px if not found)
            const headerOffset = siteHeader ? siteHeader.offsetHeight : 72;

            // Calculate absolute top position of the target relative to the viewport
            const elementPosition = targetElement.getBoundingClientRect().top;

            // Compute the target position accounting for current scroll and header offset
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Smoothly scroll the window to the computed position
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // If mobile menu is open, close it automatically upon link click
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            if (navMenu && navMenu.classList.contains('open')) {
              navMenu.classList.remove('open');
              if (mobileToggle) {
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
              }
            }

            // Update active state among navigation links
            updateActiveNavLink(targetId);
          }
        }
      });
    });
  }

  /**
   * Helper function to mark the clicked navigation link as active.
   * @param {string} targetHash - The hash of the target section (e.g. '#projects').
   */
  function updateActiveNavLink(targetHash) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === targetHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }


  /* ============================================================================
     2. NEXT-LEVEL INTERACTIVE PARTICLE CANVAS (Antigravity Style)
     ============================================================================ */

  /**
   * Initializes a lightweight, responsive particle network on the background canvas.
   * Features interactive particle displacement, connection webbing, and mouse reactivity.
   */
  function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Particle system settings optimized for clean aesthetics and 60fps performance
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 45; // Subtle, elegant density for a minimalist light theme
    const maxConnectDistance = 140; // Max distance for connection lines
    const mouseRadius = 160; // Influence radius when hovering

    // Track mouse coordinates and hovering status
    const mouse = {
      x: null,
      y: null,
      radius: mouseRadius
    };

    /**
     * Resizes canvas to match window dimensions with high-DPI scaling.
     */
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Account for device pixel ratio for crisp rendering on Retina / 4K displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    // Set initial size
    handleResize();

    /**
     * Particle Class representing an individual floating interactive node.
     */
    class Particle {
      constructor() {
        this.reset(true);
      }

      /**
       * Initializes or resets particle position and velocity.
       * @param {boolean} initial - Whether this is the first placement.
       */
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 1.2; // Small, refined particle dots
        this.vx = (Math.random() - 0.5) * 0.45; // Gentle horizontal drift
        this.vy = -(Math.random() * 0.5 + 0.2); // Slow upward float
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 20 + 10;
        this.alpha = Math.random() * 0.45 + 0.25; // Subtle transparency
      }

      /**
       * Updates particle position, applies boundaries, and calculates mouse interaction.
       */
      update() {
        // Natural gentle floating motion
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse hover interaction physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          // If particle is within mouse hover influence radius
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            // Stronger push closer to cursor, smoothly falling off
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density * 0.45;
            const directionY = forceDirectionY * force * this.density * 0.45;

            // Push gently away from cursor (Antigravity repulsion effect)
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      /**
       * Renders the particle dot on the canvas.
       */
      draw() {
        ctx.fillStyle = `rgba(100, 116, 139, ${this.alpha})`; // Clean slate-gray
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Populate particles array
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    /**
     * Draws soft connector lines between nearby particles and near the mouse.
     */
    function drawConnections() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.hypot(dx, dy);

          // Connect if particles are close enough
          if (distance < maxConnectDistance) {
            const lineOpacity = 1 - (distance / maxConnectDistance);
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineOpacity * 0.25})`; // Faint subtle slate line
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse cursor for interactive responsive web effect
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[a].x - mouse.x;
          const mdy = particles[a].y - mouse.y;
          const mouseDist = Math.hypot(mdx, mdy);

          if (mouseDist < mouse.radius) {
            const mouseLineOpacity = 1 - (mouseDist / mouse.radius);
            ctx.strokeStyle = `rgba(37, 99, 235, ${mouseLineOpacity * 0.35})`; // Subtle blue cursor tether
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    /**
     * Main animation loop running continuously via requestAnimationFrame.
     */
    function animate() {
      // Clear canvas on every frame
      ctx.clearRect(0, 0, width, height);

      // Update and draw all particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Draw connective lines
      drawConnections();

      // Request next animation frame
      requestAnimationFrame(animate);
    }

    // Event listener: Mouse move tracks cursor position
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Event listener: Mouse leave clears cursor influence
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Event listener: Window resize recomputes canvas dimensions
    window.addEventListener('resize', () => {
      handleResize();
    });

    // Start animation loop
    animate();
  }


  /* ============================================================================
     3. MOBILE NAVIGATION HAMBURGER MENU
     ============================================================================ */

  /**
   * Initializes mobile drawer toggle behavior for mobile screens.
   */
  function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }


  /* ============================================================================
     4. SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHT)
     ============================================================================ */

  /**
   * Automatically updates active state of header links based on scroll position.
   */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const siteHeader = document.getElementById('siteHeader');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 72;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - headerHeight - 50;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    });
  }


  /* ============================================================================
     5. CONTACT FORM INTERACTION & FEEDBACK
     ============================================================================ */

  /**
   * Handles contact form submission with instant user feedback.
   */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form && feedback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve field values
        const nameInput = document.getElementById('nameInput');
        const emailInput = document.getElementById('emailInput');
        const messageInput = document.getElementById('messageInput');

        if (nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim()) {
          const senderName = nameInput.value.trim();
          const senderEmail = emailInput.value.trim();
          const messageText = messageInput.value.trim();

          // Construct mailto URI to redirect directly to anthonycayana45@gmail.com
          const mailtoLink = `mailto:anthonycayana45@gmail.com?subject=${encodeURIComponent("Inquiry from " + senderName)}&body=${encodeURIComponent(messageText + "\n\n---\nFrom: " + senderName + " (" + senderEmail + ")")}`;

          // Display confirmation feedback message
          feedback.textContent = '✓ Redirecting to your mail client (anthonycayana45@gmail.com)...';
          feedback.className = 'form-feedback success';

          // Reset form fields
          form.reset();

          // Redirect to email client
          window.location.href = mailtoLink;

          // Clear feedback message after 5 seconds
          setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'form-feedback';
          }, 5000);
        } else {
          // Display error feedback message
          feedback.textContent = 'Please fill out all required fields.';
          feedback.className = 'form-feedback error';
        }
      });
    }
  }


  /* ============================================================================
     INITIALIZE ALL MODULES
     ============================================================================ */
  initSmoothScroll();   // Primary chosen feature: Smooth Scroll
  initParticleCanvas(); // Antigravity-style hover particle field
  initMobileMenu();     // Responsive hamburger menu toggle
  initScrollSpy();      // Navigation active highlight on scroll
  initContactForm();    // Interactive contact form submission

});
