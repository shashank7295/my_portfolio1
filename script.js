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
    setTimeout(initParticles, 300);
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
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Messaging System
  const messageBtn = document.getElementById('message-btn');
  const messageDrawer = document.getElementById('message-drawer');
  const messageOverlay = document.getElementById('message-overlay');
  const closeMessages = document.getElementById('close-messages');
  const messageList = document.getElementById('message-list');
  const newMessageInput = document.getElementById('new-message');
  const sendMessageBtn = document.getElementById('send-message');
  const messageBadge = document.getElementById('message-badge');
  
  // Sample users who might send messages (in a real app, this would come from a database)
  const users = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', isOnline: true },
    { id: 2, name: 'David Lee', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', isOnline: true },
    { id: 3, name: 'Emma Williams', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', isOnline: false },
    { id: 4, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', isOnline: true }
  ];
  
  // Function to toggle message drawer
  function toggleMessageDrawer() {
    messageDrawer.classList.toggle('active');
    messageOverlay.classList.toggle('active');
    
    if (messageDrawer.classList.contains('active')) {
      // Reset badge count when opening drawer
      messageBadge.textContent = '0';
    }
  }
  
  // Event listeners for opening/closing message drawer
  messageBtn.addEventListener('click', toggleMessageDrawer);
  closeMessages.addEventListener('click', toggleMessageDrawer);
  messageOverlay.addEventListener('click', toggleMessageDrawer);
  
  // Function to add a new message to the chat
  function addMessage(content, isSent = true, user = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isSent ? 'sent' : 'received');
    
    // Message content
    messageDiv.innerHTML = `
      ${content}
      <div class="message-meta">
        ${isSent 
          ? '<span>You • Just now</span> <i class="fas fa-check"></i>' 
          : `<span>${user.name} • Just now</span>`
        }
      </div>
    `;
    
    // Add message to the list
    messageList.appendChild(messageDiv);
    
    // Scroll to the bottom
    messageList.scrollTop = messageList.scrollHeight;
    
    // If it's a received message and drawer is not open, increment badge count
    if (!isSent && !messageDrawer.classList.contains('active')) {
      const currentCount = parseInt(messageBadge.textContent);
      messageBadge.textContent = currentCount + 1;
    }
  }
  
  // Function to create a notification
  function showNotification(user, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    
    notification.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" class="notification-avatar">
      <div class="notification-content">
        <div class="notification-title">${user.name}</div>
        <div class="notification-text">${message}</div>
      </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('active');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
    
    // Click notification to open messages
    notification.addEventListener('click', () => {
      if (!messageDrawer.classList.contains('active')) {
        toggleMessageDrawer();
      }
      notification.remove();
    });
  }
  
  // Event listener for sending a message
  sendMessageBtn.addEventListener('click', sendMessage);
  newMessageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  function sendMessage() {
    const message = newMessageInput.value.trim();
    if (message) {
      // Add the sent message
      addMessage(message, true);
      
      // Clear input
      newMessageInput.value = '';
      
      // Display confirmation to the user
      const notification = document.createElement('div');
      notification.classList.add('notification');
      
      notification.innerHTML = `
        <img src="sk.jpg" alt="Shashank Mishra" class="notification-avatar">
        <div class="notification-content">
          <div class="notification-title">Message Sent</div>
          <div class="notification-text">Your message has been sent to Shashank's Instagram</div>
        </div>
      `;
      
      // Add to body
      document.body.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.classList.add('active');
      }, 100);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
      
      // Redirect to Instagram on click (for mobile convenience)
      notification.addEventListener('click', () => {
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
        notification.remove();
      });
      
      // In a real implementation, you would send this to your backend
      // Here we'll do a simulated Instagram connection
      try {
        // This would be a real API endpoint in production
        const instagramUsername = 'shashank_mishra.3';
        
        // For demonstration purposes only - this shows how it would work 
        // with a real backend implementation
        console.log(`Message "${message}" sent to Instagram user ${instagramUsername}`);
        
        // Instead of the direct Instagram API (which requires authentication),
        // you would use your own backend service that handles the Instagram API
        
        // For example, using fetch in a real implementation:
        /*
        fetch('https://your-backend-service.com/send-instagram-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            instagramUsername: instagramUsername
          }),
        });
        */
      } catch (error) {
        console.error('Error sending message to Instagram:', error);
      }
    }
  }
  
  // Simulate Instagram connection check
  function simulateIncomingMessages() {
    // Show an Instagram connection status message
    if (!messageDrawer.classList.contains('active')) {
      const statusMessage = "Your messages will be sent directly to my Instagram inbox. I'll respond as soon as possible!";
      
      // Add info message to chat if empty
      if (messageList.children.length === 0) {
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('message', 'info');
        infoDiv.innerHTML = `
          <div class="instagram-info">
            <i class="fab fa-instagram"></i>
            <span>Connected to Instagram: @shashank_mishra.3</span>
          </div>
          <div class="info-text">${statusMessage}</div>
        `;
        messageList.appendChild(infoDiv);
      }
      
      // Create notification about Instagram connectivity
      const user = {
        name: 'Instagram Connection',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png'
      };
      
      // Only show this notification once
      if (!localStorage.getItem('instagram-notification-shown')) {
        showNotification(user, "Messages from this website will be sent to Shashank's Instagram inbox");
        localStorage.setItem('instagram-notification-shown', 'true');
      }
    }
  }
  
  // Start the Instagram connection simulation immediately
  simulateIncomingMessages();
  
  // Active link highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
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
  
  // Initialize particles.js
  function initParticles() {
    const theme = document.documentElement.getAttribute('data-theme');
    const particleColor = theme === 'dark' ? '#f72585' : '#4361ee';
    
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: particleColor },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 },
          move: { enable: true, speed: 3, direction: 'none', random: true, straight: false, out_mode: 'out' },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: { distance: 200, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
    }
  }
  
  initParticles();
  
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
  
  // Initialize VanillaTilt for project cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.project-card'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
    });
  }
  
  // GSAP Scroll Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.hero-content', {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power3.out',
    });
    
    gsap.from('.hero-image', {
      opacity: 0,
      x: 100,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
    
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.2,
      });
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
  
  // Hero image parallax on mouse move
  const heroImage = document.querySelector('.hero-image');
  const shapes = document.querySelectorAll('.shape');
  
  heroImage.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = heroImage.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    shapes.forEach((shape, index) => {
      shape.style.transform = `translateZ(-${(index + 1) * 20}px) rotate(${x * 5}deg) translate(${x * 20}px, ${y * 20}px)`;
    });
  });
  
  heroImage.addEventListener('mouseleave', () => {
    shapes.forEach((shape) => {
      shape.style.transform = '';
    });
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Don't prevent default - let form submit to Formspree
      // e.preventDefault();
      
      // Store reference to form message element and form itself
      const formMessage = document.getElementById('form-message');
      const form = this;
      
      // Show the message immediately (Formspree will handle the actual submission)
      if (formMessage) {
        setTimeout(function() {
          formMessage.style.display = 'block';
        }, 1000);
      }
      
      // Optional: Reset form after successful submission (Formspree will redirect)
      // This might not execute due to page redirect from Formspree
      // form.reset();
    });
  }
  
  // Instagram Direct Message Form
  const instagramForm = document.getElementById('instagram-message-form');
  if (instagramForm) {
    instagramForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('instagram-name').value.trim();
      const message = document.getElementById('instagram-message').value.trim();
      
      if (name && message) {
        // Create notification to inform user
        const notification = document.createElement('div');
        notification.classList.add('notification');
        
        notification.innerHTML = `
          <img src="sk.jpg" alt="Shashank Mishra" class="notification-avatar">
          <div class="notification-content">
            <div class="notification-title">Message Sent to Instagram</div>
            <div class="notification-text">Hi ${name}, your message has been forwarded to my Instagram inbox</div>
          </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
          notification.classList.add('active');
        }, 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          notification.classList.remove('active');
          setTimeout(() => {
            notification.remove();
          }, 300);
        }, 5000);
        
        // Prepare data for sending to Instagram
        const instagramUsername = 'shashank_mishra.3';
        console.log(`Instagram message from ${name}: "${message}" sent to @${instagramUsername}`);
        
        // In a real implementation, you would send this to your backend
        // which would then use Instagram's API or a notification system
        // to forward the message to your Instagram inbox
        
        // Optional: Offer to redirect to Instagram
        setTimeout(() => {
          if (confirm('Would you like to open Instagram Direct to continue the conversation?')) {
            window.open(`https://www.instagram.com/direct/t/${instagramUsername}`, '_blank');
          }
        }, 1500);
        
        // Reset form
        this.reset();
      }
    });
  }
});