import { showToast, ToastType } from "./toast.js";
import { createWindowCode } from "./window.js";

/* 
    TODO: LOAD APPS FROM LOCAL STORAGE OR DEFAULT CONFIG
*/

async function loadNativeApp(name, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load app: ${response.statusText}`);
            
        }
        const htmlContent = await response.text();
        createWindowCode(name, htmlContent);
    } catch(error) {
        console.error("Failed to load app:", error);
        showToast(ToastType.ERROR, "Failed to Load", "This app has failed to load successfully.");
    }
}

// * Event Listeners
// TODO: MODIFY THIS TO BE MUTABLE

const chatAppBtn = document.getElementById('chat-app-btn');
chatAppBtn.addEventListener("click", () => {
    loadNativeApp("Chat App", "/os/apps/chatApp.html");
});
const wallpaperAppBtn = document.getElementById('wallpaper-app-btn');
wallpaperAppBtn.addEventListener("click", () => {
    loadNativeApp("Wallpaper App", "/os/apps/wallpaperApp.html");
});
const browserBtn = document.getElementById('browser-btn');
browserBtn.addEventListener("click", () => {
    loadNativeApp("Quasar Browser", "/os/apps/browser/index.html");
});
