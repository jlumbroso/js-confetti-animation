class Confetti {
  constructor(options = {}) {
    // Default options
    const defaults = {
      colors: ['#6a737d', '#0366d6', '#28a745', '#ffd33d', '#f66a0a', '#6f42c1', '#ea4aaa'],
      streamingMode: false,  // If true, continues spawning confetti
      spawnRate: 40,        // Time between confetti spawns in ms
      gravity: 0.13,        // Base fall speed
      drift: 0.2,          // Horizontal movement range
      rotationSpeed: 0.4,   // Base rotation speed
      fadeOut: true,       // Whether confetti fade out when reaching bottom
      maxParticles: 150    // Maximum particles on screen at once
    };

    // Merge provided options with defaults
    this.options = { ...defaults, ...options };
    this.confetti = [];
    this.active = false;
    this.timers = [];
    
    // Create container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '0';
    this.container.style.overflow = 'visible';
    this.container.style.zIndex = '9999';
    this.container.style.pointerEvents = 'none'; // Prevent interfering with page interaction
  }

  createConfettoElement() {
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    
    outer.appendChild(inner);
    outer.style.position = 'absolute';
    outer.style.width = `${3 + 9 * Math.random()}px`;
    outer.style.height = `${3 + 9 * Math.random()}px`;
    outer.style.opacity = '1';
    outer.style.transition = 'opacity 0.5s ease-out';
    
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.backgroundColor = color;
    
    outer.style.perspective = '50px';
    outer.style.transform = `rotate(${360 * Math.random()}deg)`;
    
    const theta = 360 * Math.random();
    const axis = `rotate3D(${Math.cos(360 * Math.random())},${Math.cos(360 * Math.random())},0,`;
    
    inner.style.transform = `${axis}${theta}deg)`;
    
    return {
      element: outer,
      x: window.innerWidth * Math.random(),
      y: -100,
      theta,
      axis,
      rotation: this.options.rotationSpeed + (0.3 * Math.random()),
      dx: Math.sin(-0.1 + this.options.drift * Math.random()),
      dy: this.options.gravity + (0.18 * Math.random()),
      opacity: 1
    };
  }

  update() {
    const height = window.innerHeight;
    const now = Date.now();
    if (!this.lastUpdate) this.lastUpdate = now;
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const confetto = this.confetti[i];
      
      // Update position and rotation
      confetto.x += confetto.dx * deltaTime;
      confetto.y += confetto.dy * deltaTime;
      confetto.theta += confetto.rotation * deltaTime;
      
      // Handle bottom fade out
      if (this.options.fadeOut && confetto.y > height - 100) {
        confetto.opacity = Math.max(0, (height - confetto.y) / 100);
        confetto.element.style.opacity = confetto.opacity;
      }

      // Apply transform
      confetto.element.style.transform = 
        `translate(${confetto.x}px, ${confetto.y}px) rotate(${confetto.theta}deg)`;
      
      // Remove if out of view or completely faded
      if (confetto.y > height + 100 || confetto.opacity <= 0) {
        this.container.removeChild(confetto.element);
        this.confetti.splice(i, 1);
      }
    }

    // Continue animation if active or confetti still present
    if (this.active || this.confetti.length > 0) {
      requestAnimationFrame(() => this.update());
    }
  }

  spawn() {
    if (!this.active) return;
    
    // Only spawn if under maximum particle count
    if (this.confetti.length < this.options.maxParticles) {
      const confetto = this.createConfettoElement();
      this.confetti.push(confetto);
      this.container.appendChild(confetto.element);
    }

    // Schedule next spawn if in streaming mode
    if (this.options.streamingMode) {
      this.timers.push(
        setTimeout(() => this.spawn(), this.options.spawnRate * Math.random())
      );
    }
  }

  start(duration = null) {
    // Clean up any existing animation
    this.stop();
    
    // Initialize animation
    document.body.appendChild(this.container);
    this.active = true;
    
    // Start spawning and animation
    this.spawn();
    this.update();

    // Handle duration modes
    if (duration === null) {
      // Infinite mode - will run until stop() is called
      this.options.streamingMode = true;
    } else if (duration === 'untilComplete') {
      // Run until existing confetti finish falling
      this.options.streamingMode = false;
    } else if (typeof duration === 'number' && duration > 0) {
      // Run for specified duration
      this.options.streamingMode = true;
      this.timers.push(
        setTimeout(() => this.stop(), duration)
      );
    }
  }

  stop() {
    this.active = false;
    this.options.streamingMode = false;
    
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];

    // Clean up if immediate stop requested
    if (this.container.parentNode) {
      document.body.removeChild(this.container);
      this.confetti = [];
    }
  }
}

// Usage examples:
function startConfetti(mode) {
  const confetti = new Confetti({
    // Optional custom configuration here
    fadeOut: true,
    maxParticles: 150,
    gravity: 0.15,
    drift: 0.3
  });

  switch(mode) {
    case 'burst':
      // Single burst that falls until complete
      confetti.start('untilComplete');
      break;
    case 'timed':
      // Run for 5 seconds
      confetti.start(5000);
      break;
    case 'infinite':
      // Run until manually stopped 
      confetti.start(null);
      break;
    default:
      confetti.start(5000); // Default to 5 second burst
  }
  
  return confetti; // Return instance for manual control if needed
}