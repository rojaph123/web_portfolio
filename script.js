// ==================== THEME TOGGLE ==================== 
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.animation = null;
        localStorage.setItem('theme', 'dark');
        this.initTheme();
    }

    initTheme() {
        this.applyTheme(this.currentTheme);
        this.startBackgroundAnimation();
    }

    applyTheme(theme) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('dark-mode');
    }

    startBackgroundAnimation() {
        if (!this.animation) this.animation = new ITNetworkAnimation();
    }
}

// ==================== IT NETWORK BACKGROUND (DARK MODE) ====================
class ITNetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.glyphs = [];
        this.lastFrame = 0;
        this.frameInterval = 1000 / 45;
        this.symbols = ['API', 'AI', '{}', '</>', 'SQL', '01', 'DB', 'ML', 'UX', 'JS'];

        this.resizeCanvas();
        this.createScene();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createScene();
        });
    }

    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    createScene() {
        const nodeCount = Math.max(34, Math.min(82, Math.floor((this.width * this.height) / 18000)));
        const glyphCount = Math.max(10, Math.min(22, Math.floor(this.width / 70)));

        this.nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            radius: Math.random() * 1.8 + 1.1,
            pulse: Math.random() * Math.PI * 2
        }));

        this.glyphs = Array.from({ length: glyphCount }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            label: this.symbols[Math.floor(Math.random() * this.symbols.length)],
            opacity: Math.random() * 0.12 + 0.06,
            pulse: Math.random() * Math.PI * 2
        }));
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#070b1d');
        gradient.addColorStop(0.48, '#0a1530');
        gradient.addColorStop(1, '#071225');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = 'rgba(30, 136, 229, 0.035)';
        for (let x = 0; x < this.width; x += 80) {
            this.ctx.fillRect(x, 0, 1, this.height);
        }
        for (let y = 0; y < this.height; y += 80) {
            this.ctx.fillRect(0, y, this.width, 1);
        }
    }

    movePoint(point) {
        point.x += point.vx;
        point.y += point.vy;
        point.pulse += 0.015;

        if (point.x < -20) point.x = this.width + 20;
        if (point.x > this.width + 20) point.x = -20;
        if (point.y < -20) point.y = this.height + 20;
        if (point.y > this.height + 20) point.y = -20;
    }

    animate(timestamp = 0) {
        if (timestamp - this.lastFrame < this.frameInterval) {
            requestAnimationFrame(this.animate);
            return;
        }
        this.lastFrame = timestamp;
        this.drawBackground();

        this.nodes.forEach(node => this.movePoint(node));
        this.glyphs.forEach(glyph => this.movePoint(glyph));

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const a = this.nodes[i];
                const b = this.nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.hypot(dx, dy);
                const maxDistance = 145;

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.18;
                    this.ctx.strokeStyle = `rgba(30, 136, 229, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                    this.ctx.stroke();
                }
            }
        }

        this.nodes.forEach(node => {
            const pulse = 0.5 + Math.sin(node.pulse) * 0.35;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.46)';
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, (node.radius + pulse) * 3.2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(30, 136, 229, 0.055)';
            this.ctx.fill();
        });

        this.glyphs.forEach(glyph => {
            const pulseOpacity = glyph.opacity + Math.sin(glyph.pulse) * 0.035;
            this.ctx.font = "600 12px 'Courier New', monospace";
            this.ctx.fillStyle = `rgba(232, 238, 247, ${pulseOpacity})`;
            this.ctx.fillText(glyph.label, glyph.x, glyph.y);
        });

        requestAnimationFrame(this.animate);
    }
}

// ==================== CODE MATRIX ANIMATION (DARK MODE) ==================== 
class CodeMatrixAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.codeChars = '01<>{}()[]@#$%^&*+-=|;:.,?!`~/_\\"\'';
        this.fontSize = 15;
        this.lastFrame = 0;
        this.frameInterval = 1000 / 36;
        
        this.resizeCanvas();
        this.initializeColumns();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initializeColumns();
        });
    }

    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.columnWidth = this.fontSize + 2;
    }

    initializeColumns() {
        this.columns = [];
        const columnCount = Math.ceil(window.innerWidth / (this.columnWidth * 1.45));
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * this.columnWidth * 1.45,
                y: Math.random() * window.innerHeight,
                speed: Math.random() * 0.55 + 0.18,
                chars: this.generateCharacters(Math.floor(Math.random() * 10 + 8))
            });
        }
    }

    generateCharacters(count) {
        const chars = [];
        for (let i = 0; i < count; i++) {
            chars.push(this.codeChars[Math.floor(Math.random() * this.codeChars.length)]);
        }
        return chars;
    }

    animate(timestamp = 0) {
        if (timestamp - this.lastFrame < this.frameInterval) {
            requestAnimationFrame(this.animate);
            return;
        }
        this.lastFrame = timestamp;

        // Clear with semi-transparent overlay
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.11)';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw columns
        this.columns.forEach(column => {
            column.y += column.speed;

            // Reset when column goes off screen
            if (column.y > window.innerHeight + this.fontSize * column.chars.length) {
                column.y = -this.fontSize * column.chars.length;
                column.chars = this.generateCharacters(Math.floor(Math.random() * 10 + 8));
            }

            // Draw characters with gradient effect
            column.chars.forEach((char, index) => {
                const charY = column.y + index * this.fontSize;
                
                if (charY > 0 && charY < window.innerHeight) {
                    // Create color gradient effect - brighter at top
                    const brightness = Math.max(0, 1 - (index / column.chars.length));
                    const opacity = brightness * 0.45;
                    
                    // Color based on position
                    let color;
                    if (brightness > 0.8) {
                        this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`; // Bright cyan
                    } else if (brightness > 0.5) {
                        this.ctx.fillStyle = `rgba(30, 136, 229, ${opacity * 0.8})`; // Blue
                    } else {
                        this.ctx.fillStyle = `rgba(0, 102, 204, ${opacity * 0.5})`; // Dark blue
                    }
                    
                    this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
                    this.ctx.fillText(char, column.x, charY);
                }
            });
        });

        requestAnimationFrame(this.animate);
    }
}

// ==================== HYBRID CODE ANIMATION (BOTH MODES) ==================== 
class HybridCodeAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.particles = [];
        this.codeChars = '01<>{}()[]@#$%^&*+-=|;:.,?!`~/_\\"\'';
        this.codeSymbols = ['<', '>', '/', '{', '}', '[', ']', ';', ':', '=', '+', '-', '*', '/'];
        this.fontSize = 16;
        
        this.resizeCanvas();
        this.initializeColumns();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initializeColumns();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columnWidth = this.fontSize + 2;
    }

    initializeColumns() {
        this.columns = [];
        const columnCount = Math.ceil(this.canvas.width / this.columnWidth);
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * this.columnWidth,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 1 + 0.3,
                chars: this.generateCharacters(Math.floor(Math.random() * 10 + 5))
            });
        }
    }

    generateCharacters(count) {
        const chars = [];
        for (let i = 0; i < count; i++) {
            chars.push(this.codeChars[Math.floor(Math.random() * this.codeChars.length)]);
        }
        return chars;
    }

    createParticles() {
        this.particles = [];
        const count = 15;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                symbol: this.codeSymbols[Math.floor(Math.random() * this.codeSymbols.length)],
                size: Math.random() * 16 + 12,
                opacity: Math.random() * 0.3 + 0.1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    animate = () => {
        // Mixed background - blend of dark and light
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 14, 39, 0.92)');
        gradient.addColorStop(0.5, 'rgba(30, 50, 80, 0.88)');
        gradient.addColorStop(1, 'rgba(15, 25, 45, 0.90)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw matrix code ACROSS THE ENTIRE CANVAS (mixed)
        this.columns.forEach(column => {
            column.y += column.speed;

            if (column.y > this.canvas.height) {
                column.y = -this.fontSize * column.chars.length;
                column.chars = this.generateCharacters(Math.floor(Math.random() * 10 + 5));
            }

            column.chars.forEach((char, index) => {
                const charY = column.y + index * this.fontSize;
                
                if (charY > 0 && charY < this.canvas.height) {
                    const brightness = Math.max(0, 1 - (index / column.chars.length));
                    const opacity = brightness * 0.6;
                    
                    let color;
                    if (brightness > 0.8) {
                        this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
                    } else if (brightness > 0.5) {
                        this.ctx.fillStyle = `rgba(30, 136, 229, ${opacity * 0.8})`;
                    } else {
                        this.ctx.fillStyle = `rgba(0, 102, 204, ${opacity * 0.5})`;
                    }
                    
                    this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
                    this.ctx.fillText(char, column.x, charY);
                }
            });
        });

        // Draw floating symbols ACROSS THE ENTIRE CANVAS (mixed with matrix)
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.pulse += 0.02;

            // Wrap around edges
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.canvas.height + 50;
            if (particle.y > this.canvas.height + 50) particle.y = -50;

            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);

            const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.1;
            
            let color;
            if (particle.symbol === '<' || particle.symbol === '>') {
                color = `rgba(30, 136, 229, ${pulseOpacity})`;
            } else if (particle.symbol === '{' || particle.symbol === '}') {
                color = `rgba(255, 107, 53, ${pulseOpacity})`;
            } else if (particle.symbol === '[' || particle.symbol === ']') {
                color = `rgba(0, 255, 136, ${pulseOpacity})`;
            } else {
                color = `rgba(100, 150, 200, ${pulseOpacity})`;
            }

            this.ctx.fillStyle = color;
            this.ctx.font = `bold ${particle.size}px 'Courier New', monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.symbol, 0, 0);

            // Draw subtle glow effect
            this.ctx.strokeStyle = color.replace(/[\d.]+\)/, `${pulseOpacity * 0.4})`);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size * 0.6, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.restore();
        });

        requestAnimationFrame(this.animate);
    }
}

// ==================== SMOOTH SCROLLING & NAV HIGHLIGHTING ==================== 
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Prevent default only if it's an anchor link
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Highlight active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    updateActiveNav() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ==================== SCROLL ANIMATIONS ==================== 
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll(
            '.skill-card, .experience-card, .project-card, .student-work-card, .cert-card, .timeline-item, .skill-category'
        );
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ==================== CONTACT FORM HANDLER ==================== 
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.attachEventListeners();
        }
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        this.showMessage('Sending your message...', 'info', false);
        const submitBtn = this.form.querySelector('.btn-submit');
        submitBtn.disabled = true;

        // Simulate sending (in a real app, you'd send to a server)
        setTimeout(() => {
            this.sendEmail(formData);
            submitBtn.disabled = false;
        }, 1500);
    }

    validateForm(data) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

        if (!data.name || data.name.length < 2) {
            this.showMessage('Please enter a valid name.', 'error');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (!data.subject) {
            this.showMessage('Please select an inquiry type.', 'error');
            return false;
        }

        if (!data.message || data.message.length < 10) {
            this.showMessage('Please enter a message with at least 10 characters.', 'error');
            return false;
        }

        return true;
    }

    sendEmail(formData) {
        // Create mailto link with form data
        const mailtoLink = `mailto:oracion.rovjapheth@gmail.com?subject=Portfolio Inquiry: ${formData.subject}&body=From: ${formData.name}%0AEmail: ${formData.email}%0ACompany: ${formData.company}%0A%0AMessage:%0A${formData.message}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        this.showMessage('✓ Thank you! Your message has been sent. I will get back to you soon!', 'success');

        // Reset form
        this.form.reset();

        // Clear message after 5 seconds
        setTimeout(() => {
            this.clearMessage();
        }, 5000);
    }

    showMessage(text, type, autoHide = true) {
        const messageEl = document.getElementById('formMessage');
        messageEl.textContent = text;
        messageEl.className = `form-message ${type}`;

        if (autoHide && type !== 'error') {
            setTimeout(() => this.clearMessage(), 5000);
        }
    }

    clearMessage() {
        const messageEl = document.getElementById('formMessage');
        messageEl.textContent = '';
        messageEl.className = 'form-message';
    }
}

// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new ScrollAnimations();
    new ContactFormHandler();
    
    // Load profile and other portfolio data from Firebase
    loadProfile();
});

// Handle navigation highlight on page load
window.addEventListener('load', () => {
    const navigationManager = new NavigationManager();
    navigationManager.updateActiveNav();
});
