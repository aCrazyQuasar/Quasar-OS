window.AppAPI = {};
function registerAppFunction(name, fn) {
    window.AppAPI[name] = fn;
}

export {registerAppFunction};