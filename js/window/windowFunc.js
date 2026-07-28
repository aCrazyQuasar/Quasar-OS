import { showToast, ToastType } from "/js/toast.js";

window.ToastType = ToastType;
window.AppAPI = {};
function registerAppFunction(name, fn) {
    window.AppAPI[name] = fn;
}

registerAppFunction("showToast", (type, title, contents) => {
    showToast(type, title, contents);
});

export {registerAppFunction};