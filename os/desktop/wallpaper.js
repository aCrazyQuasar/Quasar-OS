import { DefaultWallpaper } from '/wallpapers/default.js';
const canvas = document.getElementById('background-wallpaper');
const ctx = canvas.getContext('2d');
let currentWallpaper;
let lastTime = 0;

const API = {
    width: canvas.width,
    height: canvas.height,
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    API.width = canvas.width;
    API.height = canvas.height;
}
window.addEventListener('resize', resize);
resize();

function setWallpaper(wallpaper) {
    if(currentWallpaper?.destroy) {
        currentWallpaper.destroy();
    }
    currentWallpaper = wallpaper;

    if(currentWallpaper?.init) {
        currentWallpaper.init(API);
    }
}

function renderWallpaper(time) {
    const dt = time - lastTime;
    lastTime = time;

    if(currentWallpaper?.render) {
        currentWallpaper.render(ctx, API, time, dt);
    }

    requestAnimationFrame(renderWallpaper);
}

renderWallpaper(0);

setWallpaper(DefaultWallpaper);

export { setWallpaper };