import { SystemLogger } from "../../../system/logger.js";
import { normalizePath, onModpackChange } from "../../modpackMgr.js";
import { DefaultWallpaper } from "../../wallpapers/default.js";

// Logger
const logger = new SystemLogger("Wallpaper Subsystem");
logger.log("Subsystem Initialized", "Module Loaded and Intialized");

// Setup
const canvas = document.getElementById("background-wallpaper");
const ctx = canvas.getContext("2d");
let currentWallpaper;
let lastTime = 0;
export const  API = {
    width: canvas.width,
    height: canvas.height,
};

// Canvas setup
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  API.width = canvas.width;
  API.height = canvas.height;
}
window.addEventListener("resize", resize);
resize();

//  * To Be Exported
export function setWallpaper(wallpaper, init=true) {
  if (currentWallpaper?.destroy) {
    currentWallpaper.destroy();
  }
  currentWallpaper = wallpaper;
  logger.log("Changed Wallpaper", "Changed wallpaper source");

  if (currentWallpaper?.init) {
    currentWallpaper.init(API);
  }
}

// Animation Loop
function renderWallpaper(time) {
  const dt = time - lastTime;
  lastTime = time;

  if (currentWallpaper?.render) {
    currentWallpaper.render(ctx, API, time, dt);
  }

  requestAnimationFrame(renderWallpaper);
}
renderWallpaper(0);

// TODO: Request defaults fron init setup
setWallpaper(DefaultWallpaper);