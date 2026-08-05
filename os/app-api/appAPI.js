import { showToast, ToastType } from "../components/toast.js";
import { setWallpaper } from "../desktop/wallpaper.js";

window.ToastType = ToastType;
window.AppAPI = {};
function registerAppFunction(name, fn) {
    /**
     * Registers a function to be called from apps.
     * @param {string} name - The name of the function to register.
     * @param {function} fn - The function to register.
     */
    window.AppAPI[name] = fn;
}

// TODO: ADD MORE FUNCTIONS

registerAppFunction("showToast", (type, title, contents) => {
    showToast(type, title, contents);
});
registerAppFunction("setWallpaper", (wallpaperObj) => {
    setWallpaper(wallpaperObj);
});

// Exports
console.log("AppAPI registered");
export {registerAppFunction};