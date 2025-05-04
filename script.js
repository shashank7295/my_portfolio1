document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    
    // Reinitialize particles for theme change
    setTimeout(() => {
      particlesJS.load('particles-js', getParticlesConfig(), null);
    }, 300);
  });
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  // Mobile Navigation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const closeMenu = document.querySelector('.close-menu');
  
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  if (closeMenu) {
    closeMenu.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  }
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Smooth scrolling for navigation links with offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      const navHeight = document.querySelector('.glass-nav').offsetHeight;
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - navHeight - 20, // Extra 20px buffer
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Active link highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const navHeight = document.querySelector('.glass-nav').offsetHeight;
      
      if (pageYOffset >= sectionTop - navHeight - 50) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  });
  
  // Particles.js Configuration
  function getParticlesConfig() {
    const theme = document.documentElement.getAttribute('data-theme');
    const particleColors = theme === 'dark' 
      ? ['#f72585', '#4cc9f0', '#00ffcc']  // Neon pink, cyan, teal for dark theme
      : ['#4361ee', '#4cc9f0', '#00ccff']; // Blue, cyan, light teal for light theme
    
    return {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: particleColors
        },
        shape: {
          type: "triangle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.7,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.3,
            sync: false
          }
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: particleColors[0],
          opacity: 0.5,
          width: 1.5
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: true,
            mode: "bubble"
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4
          },
          bubble: {
            distance: 200,
            size: 6,
            duration: 2,
            opacity: 0.8
          }
        }
      },
      retina_detect: true
    };
  }
  
  // Initialize Particles.js
  if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', getParticlesConfig(), null);
  }
  
  // Cursor Trail Effect
  const canvas = document.getElementById('cursor-trail');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  const trailParticles = [];
  const maxParticles = 50;
  
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.life = 1;
      this.color = document.documentElement.getAttribute('data-theme') === 'dark'
        ? `rgba(247, 37, 133, ${this.life})`  // Neon pink
        : `rgba(67, 97, 238, ${this.life})`;   // Neon blue
    }
    
    update() {
      this.life -= 0.02;
      this.size *= 0.98;
    }
    
    draw() {
      this.color = document.documentElement.getAttribute('data-theme') === 'dark'
        ? `rgba(247, 37, 133, ${this.life})`
        : `rgba(67, 97, 238, ${this.life})`;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  document.addEventListener('mousemove', (e) => {
    const particle = new TrailParticle(e.clientX, e.clientY);
    trailParticles.push(particle);
    
    if (trailParticles.length > maxParticles) {
      trailParticles.shift();
    }
  });
  
  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < trailParticles.length; i++) {
      const particle = trailParticles[i];
      particle.update();
      particle.draw();
      
      if (particle.life <= 0 || particle.size <= 0.1) {
        trailParticles.splice(i, 1);
        i--;
      }
    }
    
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
  
  // Initialize Typed.js
  if (document.getElementById('typed')) {
    new Typed('#typed', {
      strings: ['Web developer', 'UI Designer', 'Creative Coder'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
    });
  }
  
  // GSAP Animations (including 3D effects)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Content Animation
    gsap.from('.hero-content', {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power3.out',
    });
    
    // Hero Image Holographic Animation
    gsap.from('.hologram-img', {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.3,
    });
    
    // Animate shapes with 3D rotation
    gsap.to('.shape-1', {
      rotationX: 360,
      rotationY: 360,
      duration: 10,
      repeat: -1,
      ease: 'linear',
    });
    
    gsap.to('.shape-2', {
      rotationX: -360,
      rotationY: 360,
      duration: 8,
      repeat: -1,
      ease: 'linear',
    });
    
    gsap.to('.shape-3', {
      rotationX: 360,
      rotationY: -360,
      duration: 12,
      repeat: -1,
      ease: 'linear',
    });
    
    // Holographic Title Animation
    gsap.from('.hologram-title', {
      opacity: 0,
      rotationX: 90,
      rotationY: 30,
      duration: 1.5,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to('.hologram-title', {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 2,
          yoyo: true,
        });
        gsap.to('.title-name', {
          duration: 0.2,
          repeat: -1,
          repeatDelay: 3,
          onRepeat: function() {
            this.target.style.animation = 'glitch 0.5s';
          }
        });
      }
    });
    
    // Project Cards Animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        rotationX: 45,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.2,
      });
      
      // Hover 3D Effect (only on non-mobile devices)
      if (window.innerWidth > 768) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotationX: 10,
            rotationY: 10,
            duration: 0.5,
            ease: 'power3.out',
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power3.out',
          });
        });
      }
    });
    
    gsap.utils.toArray('.skill-category').forEach((skill, i) => {
      gsap.from(skill, {
        scrollTrigger: {
          trigger: skill,
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: i * 0.2,
      });
    });
    
    gsap.from('.about-image', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
      },
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out',
    });
    
    gsap.from('.about-content', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
      },
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
    
    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  }
  
  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      if (isElementInViewport(bar)) {
        bar.style.width = width;
      }
    });
  }
  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  window.addEventListener('scroll', animateSkillBars);
  animateSkillBars();
  
  // Hero image parallax on mouse move (updated for 3D)
  const heroImage = document.querySelector('.hero-image');
  const shapes = document.querySelectorAll('.shape');
  
  heroImage.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = heroImage.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    gsap.to('.hologram-img', {
      rotationX: y * 20,
      rotationY: x * 20,
      duration: 0.5,
      ease: 'power3.out',
    });
    
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        x: x * 20,
        y: y * 20,
        rotationX: y * 30,
        rotationY: x * 30,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  });
  
  heroImage.addEventListener('mouseleave', () => {
    gsap.to('.hologram-img', {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
    
    shapes.forEach((shape) => {
      gsap.to(shape, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const formMessage = document.getElementById('form-message');
      const form = this;
      
      setTimeout(function() {
        formMessage.style.display = 'block';
      }, 1000);
    });
  }
});
