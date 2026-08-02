const ASTEROID_COUNT = 40;
let asteroids = [];

class Asteroid {
    constructor(w, h) { this.reset(w, h); }

    reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 15 + 5;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.angle = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.02;
    }

    update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.vRot;

        if (this.x < -30) this.x = w + 30;
        if (this.x > w + 30) this.x = -30;
        if (this.y < -30) this.y = h + 30;
        if (this.y > h + 30) this.y = -30;
    }
}

export const FloatingBoxesWallpaper = {
    init(api) {
        asteroids = Array.from({ length: ASTEROID_COUNT }, () => new Asteroid(api.width, api.height));
    },
    render(ctx, api) {
        ctx.fillStyle = '#080a10';
        ctx.fillRect(0, 0, api.width, api.height);

        for (let a of asteroids) {
            a.update(api.width, api.height);

            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(a.angle);

            ctx.beginPath();
            ctx.rect(-a.size / 2, -a.size / 2, a.size, a.size);
            ctx.strokeStyle = '#6c7a89';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.restore();
        }
    },
    destroy() { asteroids = []; }
};