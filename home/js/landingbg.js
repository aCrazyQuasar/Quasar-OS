const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");

const nav = document.querySelector("nav");

let width = 0;
let height = 0;

const PARTICLE_COUNT = 600;
const particles = [];
const S = 0.003;
const SPEED = 0.75;

function resize() {
  width = window.innerWidth;

  const navHeight = nav
    ? nav.getBoundingClientRect().height
    : 0;

  height = window.innerHeight - navHeight;

  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resize);
resize();

function angle(x, y, t) {
  return (
    Math.sin(x * S * 1.3 + t * 0.34) * 1.5 +
    Math.cos(y * S * 1.9 - t * 0.27) * 1.5 +
    Math.sin((x + y) * S * 0.7 + t * 0.16) * 1.1
  );
}

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    life: 0,
    maxLife: 100 + Math.random() * 150,
    speedMultiplier: 0.8 + Math.random() * 0.4
  };
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = createParticle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animate(now) {
  const time = now * 0.003;

  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let p = particles[i];

    p.life++;

    const hitBoundary =
      p.x < 0 ||
      p.x >= width ||
      p.y < 0 ||
      p.y >= height;

    if (p.life >= p.maxLife || hitBoundary) {
      p = createParticle();
      particles[i] = p;
    }

    const a = angle(p.x, p.y, time);

    const vx =
      Math.cos(a) *
      SPEED *
      p.speedMultiplier;

    const vy =
      Math.sin(a) *
      SPEED *
      p.speedMultiplier;

    p.x += vx;
    p.y += vy;

    const fadeIn =
      Math.min(1, p.life / 20);

    const fadeOut =
      Math.min(1, (p.maxLife - p.life) / 20);

    const alpha =
      Math.min(fadeIn, fadeOut) * 0.8;

    ctx.fillStyle =
      `rgba(13, 87, 199, ${alpha})`;

    ctx.fillRect(
      p.x,
      p.y,
      1.8,
      1.8
    );
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);