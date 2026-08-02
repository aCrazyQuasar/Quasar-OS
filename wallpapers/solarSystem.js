let planets = [];

export const SolarSystemWallpaper = {
    init() {
        planets = [
            { radius: 60,  speed: 0.03, size: 4, color: '#a6a6a6' }, // Mercury
            { radius: 100, speed: 0.02, size: 7, color: '#e3bb76' }, // Venus
            { radius: 150, speed: 0.015, size: 8, color: '#4b9cd3' },// Earth
            { radius: 210, speed: 0.01, size: 6, color: '#cc5533' }, // Mars
            { radius: 290, speed: 0.006, size: 16, color: '#d4a373' },// Jupiter
            { radius: 370, speed: 0.004, size: 12, color: '#e0c879' } // Saturn
        ];
    },
    render(ctx, api, time) {
        const cx = api.width / 2;
        const cy = api.height / 2;
        const t = time * 0.001;

        ctx.fillStyle = 'rgba(8, 8, 18, 0.2)';
        ctx.fillRect(0, 0, api.width, api.height);

        // Sun
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff6600';
        ctx.fill();
        ctx.restore();

        // Orbit Rings & Planets
        for (let p of planets) {
            // Orbit path
            ctx.beginPath();
            ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.stroke();

            // Planet Position
            const angle = t * p.speed * 50;
            const px = cx + Math.cos(angle) * p.radius;
            const py = cy + Math.sin(angle) * p.radius;

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    },
    destroy() { planets = []; }
};