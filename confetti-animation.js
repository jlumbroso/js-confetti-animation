class Confetti {
  constructor(options = {}) {
    // Default options
    const defaults = {
      colors: ['#6a737d', '#0366d6', '#28a745', '#ffd33d', '#f66a0a', '#6f42c1', '#ea4aaa'],
      streamingMode: false,
      spawnRate: 40,        // Time between confetti spawns in ms
      gravity: 0.13,        // Base fall speed
      drift: 0.2,          // Horizontal movement range
      rotationSpeed: 0.4,   // Base rotation speed
      fadeOut: true,        // Whether confetti fade out when reaching bottom
      maxParticles: 150     // Maximum particles on screen at once
    };

    this.options = { ...defaults, ...options };
    this.confetti = [];
    this.active = false;
    this.timers = [];
    
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '0';
    this.container.style.overflow = 'visible';
    this.container.style.zIndex = '9999';
    this.container.style.pointerEvents = 'none';
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
    if (!this.active && this.confetti.length === 0) return;

    const height = window.innerHeight;
    const now = Date.now();
    if (!this.lastUpdate) this.lastUpdate = now;
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const confetto = this.confetti[i];
      
      confetto.x += confetto.dx * deltaTime;
      confetto.y += confetto.dy * deltaTime;
      confetto.theta += confetto.rotation * deltaTime;
      
      if (this.options.fadeOut && confetto.y > height - 100) {
        confetto.opacity = Math.max(0, (height - confetto.y) / 100);
        confetto.element.style.opacity = confetto.opacity;
      }

      confetto.element.style.transform = 
        `translate(${confetto.x}px, ${confetto.y}px) rotate(${confetto.theta}deg)`;
      
      if (confetto.y > height + 100 || confetto.opacity <= 0) {
        this.container.removeChild(confetto.element);
        this.confetti.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.update());
  }

  spawn() {
    if (!this.active) return;
    
    if (this.confetti.length < this.options.maxParticles) {
      const confetto = this.createConfettoElement();
      this.confetti.push(confetto);
      this.container.appendChild(confetto.element);
    }

    if (this.active) {
      setTimeout(() => this.spawn(), this.options.spawnRate);
    }
  }

  start(duration = null) {
    // Clear any existing animation
    this.stop();
    
    // Start new animation
    document.body.appendChild(this.container);
    this.active = true;
    
    // Start spawning and animation loop
    this.spawn();
    this.update();

    // Handle duration modes
    if (duration === 'untilComplete') {
      // Run single burst then stop spawning
      setTimeout(() => {
        this.active = false;
      }, 100);
    } else if (typeof duration === 'number' && duration > 0) {
      // Run for specified duration
      setTimeout(() => {
        this.active = false;
      }, duration);
    }
    // If duration is null, run until stop() is called
  }

  stop() {
    this.active = false;
    
    // Clear all confetti immediately
    if (this.container.parentNode) {
      document.body.removeChild(this.container);
    }
    this.confetti = [];
    this.lastUpdate = null;
  }
}