const STAR_COUNT = 400;
let stars = [];

class WarpStar {
    constructor() { this.reset(true); }

    reset(initial = false) {
        this.x = (Math.random() - 0.5) * 1000;
        this.y = (Math.random() - 0.5) * 1000;
        this.z = initial ? Math.random() * 1000 : 1000;
        this.pz = this.z;
    }

    update(speed) {
        this.pz = this.z;
        this.z -= speed;
        if (this.z <= 1) this.reset();
    }
}

export const WarpSpeedWallpaper = {
    init() {
        stars = Array.from({ length: STAR_COUNT }, () => new WarpStar());
    },
    render(ctx, api) {
        const cx = api.width / 2;
        const cy = api.height / 2;

        ctx.fillStyle = 'rgba(5, 5, 15, 0.3)'; // Trail effect
        ctx.fillRect(0, 0, api.width, api.height);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        for (let s of stars) {
            s.update(1);

            const sx = (s.x / s.z) * cx + cx;
            const sy = (s.y / s.z) * cy + cy;
            const px = (s.x / s.pz) * cx + cx;
            const py = (s.y / s.pz) * cy + cy;

            if (sx >= 0 && sx <= api.width && sy >= 0 && sy <= api.height) {
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }
        }
    },
    destroy() { stars = []; }
};