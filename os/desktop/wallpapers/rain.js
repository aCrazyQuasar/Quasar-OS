/**
 * Quasar OS Dynamic Wallpaper: Chill Rainy Day
 * Ambient rain effect with smooth ripples and soft atmospheric lighting.
 */

class Raindrop {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, isInitial = false) {
    this.x = Math.random() * width;
    this.y = isInitial ? Math.random() * height : -20 - Math.random() * 50;
    this.length = 15 + Math.random() * 25;
    this.speed = 4 + Math.random() * 6;
    this.opacity = 0.15 + Math.random() * 0.35;
    this.thickness = 1 + Math.random() * 1.2;
  }

  update(width, height, dt, createRippleCallback) {
    const deltaMultiplier = dt / 16.67;
    this.y += this.speed * deltaMultiplier;

    if (this.y >= height) {
      createRippleCallback(this.x, height - 2 - Math.random() * 5);
      this.reset(width, height);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.length * 0.1, this.y + this.length);
    ctx.strokeStyle = `rgba(180, 205, 235, ${this.opacity})`;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.maxRadius = 15 + Math.random() * 25;
    this.opacity = 0.4;
    this.speed = 0.3 + Math.random() * 0.4;
    this.active = true;
  }

  update(dt) {
    const deltaMultiplier = dt / 16.67;
    this.radius += this.speed * deltaMultiplier;
    this.opacity -= 0.008 * deltaMultiplier;

    if (this.opacity <= 0 || this.radius >= this.maxRadius) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radius, this.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(175, 200, 230, ${Math.max(0, this.opacity)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

let drops = [];
let ripples = [];
const DROP_COUNT = 140;

export const RainWallpaper = {
  init(API) {
    drops = Array.from({ length: DROP_COUNT }, () => new Raindrop(API.width, API.height));
    ripples = [];
  },

  render(ctx, API, time, dt) {
    const { width, height } = API;
    const safeDt = Math.min(dt, 64);

    // 1. Chill Atmospheric Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#0c131d');
    bgGradient.addColorStop(0.5, '#131e2b');
    bgGradient.addColorStop(1, '#1a2636');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Fog Glows
    const glowX = width * 0.5 + Math.sin(time * 0.0003) * (width * 0.2);
    const glowY = height * 0.4 + Math.cos(time * 0.0004) * (height * 0.1);
    const ambientGlow = ctx.createRadialGradient(
      glowX, glowY, 50,
      glowX, glowY, Math.max(width, height) * 0.6
    );
    ambientGlow.addColorStop(0, 'rgba(60, 90, 120, 0.15)');
    ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, width, height);

    // Helper to spawn ripples
    const spawnRipple = (x, y) => {
      if (ripples.length < 50) {
        ripples.push(new Ripple(x, y));
      }
    };

    // 3. Render Ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.update(safeDt);
      ripple.draw(ctx);
      if (!ripple.active) {
        ripples.splice(i, 1);
      }
    }

    // 4. Render Raindrops
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      drop.update(width, height, safeDt, spawnRipple);
      drop.draw(ctx);
    }

    // 5. Soft Ground Mist Line
    const mistGradient = ctx.createLinearGradient(0, height - 120, 0, height);
    mistGradient.addColorStop(0, 'rgba(20, 32, 48, 0)');
    mistGradient.addColorStop(1, 'rgba(20, 32, 48, 0.6)');
    ctx.fillStyle = mistGradient;
    ctx.fillRect(0, height - 120, width, 120);
  },

  destroy() {
    drops = [];
    ripples = [];
  }
};