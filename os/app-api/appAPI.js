import { showToast, ToastType } from "../js/toast.js";
import { setWallpaper } from "./wallpaper.js";

window.ToastType = ToastType;
window.AppAPI = {};
function registerAppFunction(name, fn) {
    window.AppAPI[name] = fn;
}

registerAppFunction("showToast", (type, title, contents) => {
    showToast(type, title, contents);
});
registerAppFunction("setWallpaper", (wallpaperObj) => {
    setWallpaper(wallpaperObj);
});

console.log("AppAPI registered");
export {registerAppFunction};