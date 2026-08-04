// Configuration
const DISK_PARTICLE_COUNT = 800;
const JET_PARTICLE_COUNT = 300;
const STAR_COUNT = 300;

// Dynamic 3D tilt angles (radians)
const TILT_X = 0.48; // Pitch
const TILT_Z = -0.35; // Roll

let diskParticles = [];
let jetParticles = [];
let stars = [];

class Star {
    constructor() { this.reset(); }
    reset() {
        this.nx = Math.random();
        this.ny = Math.random();
        this.size = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.003;
    }
    update() {
        this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.006;
        this.alpha = Math.max(0.1, Math.min(0.85, this.alpha));
    }
}

class DiskParticle {
    constructor() { this.reset(); }
    reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 260 + 75;
        this.speed = (Math.random() * 0.0018 + 0.0006) * (220 / this.radius);
        this.baseSize = Math.random() * 3 + 1;
        this.yOffset = (Math.random() - 0.5) * 18;
        this.hue = Math.random() * 45 + 10;
        this.isDust = Math.random() < 0.15;
    }

    update() {
        this.angle += this.speed;
        this.radius -= 0.05;
        if (this.radius < 68) {
            this.reset();
            this.radius = 335;
        }
    }
}

class JetParticle {
    constructor() { this.reset(); }
    reset() {
        this.distance = Math.random() * 5;
        this.direction = Math.random() < 0.5 ? -1 : 1; 
        this.velocity = Math.random() * 1.5 + 1.0;
        this.acceleration = 1.04;
        
        const spreadAngle = Math.random() * Math.PI * 2;
        const spreadRadius = Math.random() * 0.4;
        this.vx = Math.cos(spreadAngle) * spreadRadius;
        this.vz = Math.sin(spreadAngle) * spreadRadius;

        this.x = (Math.random() - 0.5) * 4;
        this.z = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 3 + 1;
        this.life = 0;
        this.maxLife = Math.random() * 70 + 40;
    }

    update() {
        this.velocity *= this.acceleration;
        this.distance += this.velocity;
        
        this.x += this.vx * (this.distance * 0.02);
        this.z += this.vz * (this.distance * 0.02);

        this.life++;
        if (this.life >= this.maxLife) this.reset();
    }
}

export const QuasarWallpaper = {
    init(api) {
        stars = Array.from({ length: STAR_COUNT }, () => new Star());
        diskParticles = Array.from({ length: DISK_PARTICLE_COUNT }, () => new DiskParticle());
        jetParticles = Array.from({ length: JET_PARTICLE_COUNT }, () => new JetParticle());
    },

    render(ctx, api, time, dt) {
        const cx = api.width / 2;
        const cy = api.height / 2;

        // --- 1. Deep Space Background ---
        ctx.fillStyle = '#020005';
        ctx.fillRect(0, 0, api.width, api.height);

        // Core Ambient Glow
        const bgGlow = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(api.width, api.height) * 0.75);
        bgGlow.addColorStop(0, 'rgba(40, 10, 65, 0.3)');
        bgGlow.addColorStop(0.4, 'rgba(15, 5, 30, 0.15)');
        bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, api.width, api.height);

        // Stars
        for (let s of stars) {
            s.update();
            ctx.beginPath();
            ctx.arc(s.nx * api.width, s.ny * api.height, Math.max(0.1, s.size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.fill();
        }

        // --- 2. Calculate 3D Accretion Disk Positions ---
        const projectedDisk = [];
        
        for (let p of diskParticles) {
            p.update();

            let x3d = Math.cos(p.angle) * p.radius;
            let y3d = p.yOffset;
            let z3d = Math.sin(p.angle) * p.radius;

            let y1 = y3d * Math.cos(TILT_X) - z3d * Math.sin(TILT_X);
            let z1 = y3d * Math.sin(TILT_X) + z3d * Math.cos(TILT_X);

            let x2 = x3d * Math.cos(TILT_Z) - y1 * Math.sin(TILT_Z);
            let y2 = x3d * Math.sin(TILT_Z) + y1 * Math.cos(TILT_Z);

            // Clip anything behind the camera plane
            if (z1 >= 400) continue;

            const scale = 450 / (450 - z1); 

            projectedDisk.push({
                x: cx + x2 * scale,
                y: cy + y2 * scale,
                z: z1,
                scale: scale,
                particle: p
            });
        }

        // Sort Depth: Background particles (z < 0) render first
        projectedDisk.sort((a, b) => a.z - b.z);

        // --- JET RENDERER ---
        const renderJets = (renderFront) => {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            
            for (let j of jetParticles) {
                const isFront = j.direction > 0;
                if ((renderFront && !isFront) || (!renderFront && isFront)) continue;

                j.update();

                let x3d = j.x;
                let y3d = j.direction * j.distance;
                let z3d = j.z;

                let y1 = y3d * Math.cos(TILT_X) - z3d * Math.sin(TILT_X);
                let z1 = y3d * Math.sin(TILT_X) + z3d * Math.cos(TILT_X);

                let x2 = x3d * Math.cos(TILT_Z) - y1 * Math.sin(TILT_Z);
                let y2 = x3d * Math.sin(TILT_Z) + y1 * Math.cos(TILT_Z);

                // Clip particles behind the camera horizon to prevent negative scale
                if (z1 >= 400) continue;

                const scale = 450 / (450 - z1);
                
                // Guard radius against zero or negative values
                const radius = Math.max(0.1, j.size * scale);

                const lifeRatio = j.life / j.maxLife;
                const alpha = Math.sin((1 - lifeRatio) * Math.PI) * 0.85;

                const hue = 180 + lifeRatio * 60; 

                ctx.beginPath();
                ctx.arc(cx + x2 * scale, cy + y2 * scale, radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 100%, ${85 - lifeRatio * 35}%, ${alpha})`;
                ctx.fill();
            }
            ctx.restore();
        };

        // --- LAYER 1: BACK JET ---
        renderJets(false);

        // --- LAYER 2: BACK DISK & BLACK HOLE ---
        let blackHoleRendered = false;

        for (let item of projectedDisk) {
            if (!blackHoleRendered && item.z >= 0) {
                
                // Central Event Horizon
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, 65, 0, Math.PI * 2);
                ctx.fillStyle = '#000000';
                ctx.shadowBlur = 40;
                ctx.shadowColor = '#000000';
                ctx.fill();
                ctx.restore();

                blackHoleRendered = true;
            }

            // Draw Accretion Disk Particles
            const p = item.particle;
            const depthFactor = (item.z + 250) / 500; 
            const pSize = Math.max(0.1, p.baseSize * item.scale);

            ctx.save();
            if (p.isDust) {
                ctx.beginPath();
                ctx.arc(item.x, item.y, pSize * 1.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(5, 2, 8, ${0.4 + depthFactor * 0.4})`;
                ctx.fill();
            } else {
                ctx.globalCompositeOperation = 'lighter';
                const alpha = Math.max(0.15, Math.min(1, depthFactor * 0.95));
                ctx.beginPath();
                ctx.arc(item.x, item.y, pSize, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue + depthFactor * 25}, 100%, ${45 + depthFactor * 35}%, ${alpha})`;
                ctx.fill();
            }
            ctx.restore();
        }

        // --- LAYER 3: FRONT JET ---
        renderJets(true);
    },

    destroy() {
        stars = [];
        diskParticles = [];
        jetParticles = [];
    }
};