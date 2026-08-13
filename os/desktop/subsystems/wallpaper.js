import { normalizePath, onModpackChange } from '../modpackMgr.js';
import { DefaultWallpaper } from '../wallpapers/default.js';

// Setup
const canvas = document.getElementById('background-wallpaper');
const ctx = canvas.getContext('2d');
let currentWallpaper;
let lastTime = 0;
const API = {
    width: canvas.width,
    height: canvas.height,
}

// Canvas setup
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    API.width = canvas.width;
    API.height = canvas.height;
}
window.addEventListener('resize', resize);
resize();

//  * To Be Exported
function setWallpaper(wallpaper) {
    if(currentWallpaper?.destroy) {
        currentWallpaper.destroy();
    }
    currentWallpaper = wallpaper;
    console.log("🚀 ~ setWallpaper to new wallpaper");

    if(currentWallpaper?.init) {
        currentWallpaper.init(API);
    }
}

// Animation Loop
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



// ! MODPACK SUPPORT
onModpackChange(async (e) => {
    const { pack, manifest } = e.detail;

    if (manifest.defaultWallpaper) {
        const rawBlob = pack.get(normalizePath(manifest.defaultWallpaper));

        if (!rawBlob) {
            console.error("Wallpaper file not found in modpack.");
            return;
        }

        const jsBlob = new Blob([rawBlob], { type: 'application/javascript' });
        const objectUrl = URL.createObjectURL(jsBlob);

        try {
            const module = await import(objectUrl);
            const wallpaper = module.default || module;

            // ----------------------------------------------------
            // 🛠️ DEFINE YOUR CUSTOM API FUNCTIONS HERE
            // ----------------------------------------------------
            const packAPI = {
                ...API, // Includes canvas width and height

                // 1. Existing helper to get raw file Blobs
                getFile(filePath) {
                    return pack.get(normalizePath(filePath));
                },

                // 2. Example: Get a ready-to-use Object URL for any asset
                getAssetUrl(filePath, mimeType = '') {
                    const blob = pack.get(normalizePath(filePath));
                    if (!blob) return null;
                    
                    const typedBlob = mimeType ? new Blob([blob], { type: mimeType }) : blob;
                    return URL.createObjectURL(typedBlob);
                },

                // 3. Example: Read a text or JSON file directly from the pack
                async getTextFile(filePath) {
                    const blob = pack.get(normalizePath(filePath));
                    if (!blob) return null;
                    return await blob.text();
                },

                // 4. Example: Custom logging helper
                log(...args) {
                    console.log(`[Modpack Wallpaper]:`, ...args);
                }
            };

            // Pass the updated API to the wallpaper's init function
            if (wallpaper.init) {
                wallpaper.init(packAPI);
            }

            setWallpaper(wallpaper);

        } catch (err) {
            console.error("Failed to load wallpaper module:", err);
        } finally {
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        }
    }
});