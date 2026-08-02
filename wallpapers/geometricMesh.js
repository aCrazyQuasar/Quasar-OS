// Configuration
const PARTICLE_COUNT = 70;
const MAX_DISTANCE = 150;

let particles = [];
let mouse = { x: null, y: null };
let handleMouseMove, handleMouseLeave;

class Particle {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
}

export const GeometricMeshWallpaper = {
    /**
     * Initializes wallpaper state and event listeners
     */
    init(api) {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle(api.width, api.height));
        }

        // Track mouse position for interactive connections
        handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
    },

    /**
     * Renders the current frame onto the canvas
     */
    render(ctx, api, time, dt) {
        // Dark animated gradient background
        const hue = (time * 0.01) % 360;
        const bgGradient = ctx.createLinearGradient(0, 0, api.width, api.height);
        bgGradient.addColorStop(0, `hsla(${hue}, 40%, 8%, 1)`);
        bgGradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 40%, 4%, 1)`);

        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, api.width, api.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update(api.width, api.height);

            // Draw particle point
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue + 40}, 80%, 70%)`;
            ctx.fill();

            // Connect nearby particles with glowing lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DISTANCE) {
                    const alpha = 1 - dist / MAX_DISTANCE;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `hsla(${hue + 20}, 70%, 60%, ${alpha * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connect particles to the mouse pointer if present
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DISTANCE * 1.2) {
                    const alpha = 1 - dist / (MAX_DISTANCE * 1.2);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `hsla(${hue + 120}, 90%, 75%, ${alpha * 0.8})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }
    },

    /**
     * Cleans up event listeners when switching wallpapers
     */
    destroy() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        particles = [];
    }
};