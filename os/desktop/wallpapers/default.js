/**
 * Default Space-Themed Wallpaper for Browser OS
 * Slow & Cinematic Edition
 * Compatible with wallpaper.js API
 */
export const DefaultWallpaper = {
  stars: [],
  shootingStars: [],
  nebulae: [],

  init(api) {
    this.width = api.width;
    this.height = api.height;
    this.generateCosmos();
  },

  generateCosmos() {
    this.stars = [];
    const density = 0.0003; 
    const totalStars = Math.floor(this.width * this.height * density);

    for (let i = 0; i < totalStars; i++) {
      const depth = Math.random(); // 0 (far) to 1 (near)
      const sizeSeed = Math.random();

      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        // Layering depth determines size & drift speed
        radius: sizeSeed > 0.96 ? Math.random() * 1.2 + 1.8 : sizeSeed > 0.75 ? Math.random() * 0.8 + 0.8 : Math.random() * 0.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1), // Ultra slow twinkle
        isBright: sizeSeed > 0.96,
        // Slow cinematic velocity scaled by distance depth
        vx: (Math.random() * 0.03 + 0.01) * (depth + 0.2),
        vy: (Math.random() * 0.01 + 0.002) * (depth + 0.2)
      });
    }

    // 2. Slow-shifting Cosmic Nebulae
    this.nebulae = [
      {
        xRatio: 0.25,
        yRatio: 0.3,
        radiusRatio: 0.55,
        colorStops: ['rgba(110, 30, 200, ', 'rgba(45, 10, 90, ', 'rgba(5, 3, 15, ']
      },
      {
        xRatio: 0.75,
        yRatio: 0.65,
        radiusRatio: 0.6,
        colorStops: ['rgba(0, 110, 220, ', 'rgba(10, 25, 60, ', 'rgba(2, 5, 18, ']
      },
      {
        xRatio: 0.5,
        yRatio: 0.45,
        radiusRatio: 0.45,
        colorStops: ['rgba(200, 40, 100, ', 'rgba(50, 5, 40, ', 'rgba(0, 0, 0, ']
      }
    ];

    this.shootingStars = [];
  },

  spawnShootingStar() {
    const startTop = Math.random() < 0.5;
    this.shootingStars.push({
      x: startTop ? Math.random() * this.width : -100,
      y: startTop ? -100 : Math.random() * (this.height * 0.5),
      length: Math.random() * 200 + 150, // Longer, dramatic tail
      speed: Math.random() * 3 + 2,      // Very slow, graceful speed
      angle: Math.PI / 4 + (Math.random() * 0.05 - 0.025),
      alpha: 0.9,
      width: Math.random() * 1.5 + 1
    });
  },

  render(ctx, api, time, dt) {
    if (this.width !== api.width || this.height !== api.height) {
      this.width = api.width;
      this.height = api.height;
      this.generateCosmos();
    }

    // --- A. Deep Space Void ---
    ctx.fillStyle = '#02030a';
    ctx.fillRect(0, 0, this.width, this.height);

    // --- B. Ultra-Slow Breathing Nebulae ---
    this.nebulae.forEach((neb, idx) => {
      const centerX = this.width * neb.xRatio;
      const centerY = this.height * neb.yRatio;
      const maxRadius = Math.max(this.width, this.height) * neb.radiusRatio;

      // Extremely subtle, ultra-slow orbital motion and pulsing
      const pulse = Math.sin(time * 0.0001 + idx) * 0.02 + 0.12;
      const driftX = Math.cos(time * 0.00005 + idx) * 40;
      const driftY = Math.sin(time * 0.00005 + idx) * 40;

      const grad = ctx.createRadialGradient(
        centerX + driftX, centerY + driftY, 0,
        centerX + driftX, centerY + driftY, maxRadius
      );

      grad.addColorStop(0, `${neb.colorStops[0]}${pulse})`);
      grad.addColorStop(0.5, `${neb.colorStops[1]}${pulse * 0.45})`);
      grad.addColorStop(1, `${neb.colorStops[2]}0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
    });

    // --- C. Cinematic Star Drift & Twinkle ---
    this.stars.forEach(star => {
      // Slow star movement
      star.x += star.vx;
      star.y += star.vy;

      // Wrap stars around screen edges smoothly
      if (star.x > this.width) star.x = 0;
      if (star.y > this.height) star.y = 0;

      // Gentle brightness pulsation
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.9 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      ctx.save();
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#ffffff';

      // Star Body
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate Cross Flare for bright stars
      if (star.isBright && star.alpha > 0.4) {
        ctx.strokeStyle = `rgba(200, 230, 255, ${star.alpha * 0.35})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(star.x - star.radius * 3.5, star.y);
        ctx.lineTo(star.x + star.radius * 3.5, star.y);
        ctx.moveTo(star.x, star.y - star.radius * 3.5);
        ctx.lineTo(star.x, star.y + star.radius * 3.5);
        ctx.stroke();
      }

      ctx.restore();
    });

    // --- D. Rare, Slow-Motion Shooting Stars ---
    if (Math.random() < 0.002 && this.shootingStars.length < 2) {
      this.spawnShootingStar();
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.003; // Fades out very slowly

      if (ss.alpha <= 0 || ss.x > this.width + ss.length || ss.y > this.height + ss.length) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
      grad.addColorStop(0.25, `rgba(180, 225, 255, ${ss.alpha * 0.5})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = ss.width;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
  },

  destroy() {
    this.stars = [];
    this.shootingStars = [];
    this.nebulae = [];
  }
};