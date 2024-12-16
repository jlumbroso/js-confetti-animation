// Confetti animation class
class Confetti {
  constructor(colors = ['#6a737d', '#0366d6', '#28a745', '#ffd33d', '#f66a0a', '#6f42c1', '#ea4aaa']) {
    this.colors = colors;
    this.confetti = [];
    
    // Create container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '0';
    this.container.style.overflow = 'visible';
    this.container.style.zIndex = '9999';
  }

  // Create a single confetti particle
  createConfettoElement() {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    
    outer.appendChild(inner);
    outer.style.position = 'absolute';
    outer.style.width = `${3 + 9 * Math.random()}px`;
    outer.style.height = `${3 + 9 * Math.random()}px`;
    
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
      rotation: 0.4 + 0.3 * Math.random(),
      dx: Math.sin(-0.1 + 0.2 * Math.random()),
      dy: 0.13 + 0.18 * Math.random()
    };
  }

  // Update confetti animation frame
  update() {
    const height = window.innerHeight;
    const now = Date.now();
    if (!this.lastUpdate) this.lastUpdate = now;
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const confetto = this.confetti[i];
      
      // Update position
      confetto.x += confetto.dx * deltaTime;
      confetto.y += confetto.dy * deltaTime;
      confetto.theta += confetto.rotation * deltaTime;
      
      // Apply transform
      confetto.element.style.transform = `translate(${confetto.x}px, ${confetto.y}px) rotate(${confetto.theta}deg)`;
      
      // Remove if out of view
      if (confetto.y > height + 100) {
        this.container.removeChild(confetto.element);
        this.confetti.splice(i, 1);
      }
    }

    if (this.confetti.length > 0) {
      requestAnimationFrame(() => this.update());
    } else {
      this.stop();
    }
  }

  // Start confetti animation
  start(duration = 5000) {
    document.body.appendChild(this.container);
    
    // Create confetti elements
    const createConfetti = () => {
      if (!this.active) return;
      
      const confetto = this.createConfettoElement();
      this.confetti.push(confetto);
      this.container.appendChild(confetto.element);
      
      if (this.active) {
        setTimeout(createConfetti, 40 * Math.random());
      }
    };

    this.active = true;
    createConfetti();
    this.update();

    // Stop after duration
    if (duration) {
      setTimeout(() => this.stop(), duration);
    }
  }

  // Stop animation
  stop() {
    this.active = false;
    if (this.container.parentNode) {
      document.body.removeChild(this.container);
    }
    this.confetti = [];
  }
}

// Usage example:
function startConfetti(duration) {
  const confetti = new Confetti();
  confetti.start(duration);
}
