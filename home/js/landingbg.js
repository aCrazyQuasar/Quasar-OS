const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize)
resize();

let time = 0;

let stars = [];
let amount = 200;
for (let i = 0; i < amount; i++) {
    stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * 10,
        lz: undefined
    });
}

function animate() {

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
        s.lz = s.z

        s.z -= 0.01;
        if (s.z <= 0) {
            s.lz = 10.01
            s.z = 10;
        }

        const tlx = cx - (s.x / s.lz);
        const tly = cy - (s.y / s.lz);
        const tx = cx - (s.x / s.z);
        const ty = cy - (s.y / s.z);

        ctx.beginPath();
        ctx.moveTo(tlx, tly);
        ctx.lineTo(tx, ty);

        ctx.strokeStyle = "white"; 
        ctx.lineWidth = 2; 
        ctx.stroke();
    }


    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);