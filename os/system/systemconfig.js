import { showToast, ToastType } from "../ui/toast.js";

// ! Load system configuration from local storage or default JSON files
/**
 * Loads a system configuration object
 *
 * @export
 * @async
 * @param {string} name 
 * @returns {Array} 
 */
export async function loadConfig(name) {
    const stored = localStorage.getItem(name);

    if (stored) {
        console.log(`Using stored config for ${name}`);
        const parsed = JSON.parse(stored);
        return parsed[name] || parsed; 
    }

    let defaults;
    try {
        const response = await fetch(`/os/system/${name}.json`);
        const data = await response.json();

        localStorage.setItem(name, JSON.stringify(data));

        defaults = data[name] || data;
    } catch (error) {
        console.error(`Error fetching default config for ${name}:`, error);
    }

    console.log(`Using default config for ${name}`);
    return defaults;
}

// ! Update system configuration in local storage
/**
 * Updates a system configuration file  
 *
 * @async
 * @export
 * @param {string} name 
 * @param {Array} newItems 
 * @returns {Array} 
 */
export async function updateConfig(name, newItems) {
    const currentList = await loadConfig(name) || [];

    const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];

    const updatedList = [...currentList, ...itemsToAdd];

    localStorage.setItem(name, JSON.stringify({ [name]: updatedList }));

    console.log(`Updated config for ${name}:`, updatedList);
    return updatedList; // Returns the updated Array
}

// ! Reset system configuration to default
/**
 * Resets a system configuration file
 *
 * @export
 * @async
 * @param {string} name 
 * @returns {Array} 
 */
export async function resetConfig(name) {
  localStorage.removeItem(name);

  const defaultConfig = await loadConfig(name);

  console.log(
    `Config for "${name}" has been reset to defaults:`,
    defaultConfig,
  );
  return defaultConfig;
}

// ! Load all system configurations
// * Set up config array variables for each config file
export let wallpapersConfig = [];
export let appsConfig = [];
export let navConfig = [];
/**
 * Reloads all system configuration files and logs them to the console
 *
 * @async
 * @returns {*} 
 */
async function loadAllConfigs() {
    wallpapersConfig = await loadConfig("wallpapers");
    console.log("Wallpapers config loaded:", wallpapersConfig);

    // TODO: Load other configs as needed
}

// ! Initialize system configurations on startup

loadAllConfigs();

// TODO: document this
export function saveConfig(name, data) {
    localStorage.setItem(
        name,
        JSON.stringify({ [name]: data })
    );
}

