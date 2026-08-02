import { showToast, ToastType } from "/js/toast.js";
import { createWindowCode } from "/js/window/windowObj.js";

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

const chatAppBtn = document.getElementById('chat-app-btn');
chatAppBtn.addEventListener("click", () => {
    loadNativeApp("Chat App", "/apps/chatApp.html");
});
const wallpaperAppBtn = document.getElementById('wallpaper-app-btn');
wallpaperAppBtn.addEventListener("click", () => {
    loadNativeApp("Wallpaper App", "/apps/wallpaperApp.html");
});
