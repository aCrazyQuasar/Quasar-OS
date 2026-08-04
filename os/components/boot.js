const canvas = document.getElementById('boot-star-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Stars
const stars = [];
const starCount = 180;
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        duration: 2 + Math.random() * 8, 
        offset: Math.random() * Math.PI * 2 
    });
}

let lastTime = performance.now();
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;

    lastTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        // Update opacity over time using a sine wave
        star.offset += (Math.PI * 2 / star.duration) * deltaTime;
        const opacity = (Math.sin(star.offset) + 1) / 2; // Normalizes value between 0 and 1

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// booting
const bootBtn = document.getElementById('boot-launch');
bootBtn.addEventListener("click", async () => {
    const bootScreen = document.getElementById("boot-screen");
    bootScreen.animate(
        [
            {opacity:1},
            {opacity:0}
        ],
        {
            duration: 700,
            fill:"forwards"
        }
    );
    document.documentElement.requestFullscreen();
    console.log("Quasar OS Launched Successfully!");
    await sleep(700);
    bootScreen.remove();
});