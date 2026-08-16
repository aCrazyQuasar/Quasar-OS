import { createWindowJsDelivr } from "../components/window.js";
import {
  createQpack,
  downloadQpack,
  extractQpack,
  loadQpack,
} from "../desktop/modpackMgr.js";
import { setWallpaper } from "../desktop/subsystems/wallpaper/wallpaper.js";
import { showToast, ToastType } from "../ui/toast.js";

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

// * Window Sys
registerAppFunction("createWindowJsDelivr", (title, url) => {
  createWindowJsDelivr(title, url);
});

// * QPACK
registerAppFunction("downloadQpack", async (files, packname) => {
  const qpack = await createQpack(files);

  downloadQpack(qpack, packname);
});
registerAppFunction("extractQpack", (qpack) => {
  return extractQpack(qpack);
});
registerAppFunction("loadQpack", (qpack) => {
  return loadQpack(qpack);
});

// Exports
console.log("AppAPI registered");
export { registerAppFunction };
