// Load ocnfiguration json
async function loadConfig(name) {
    const stored = localStorage.getItem(name);

    if (stored) {
        return JSON.parse(stored);
        console.log(`Using stored config for ${name}`);
    }

    try{
        // Get default config file
        const defaults = await fetch(`/os/system/${name}.json`)
            .then(r => r.json());

        localStorage.setItem(
            name,
            JSON.stringify(defaults)
        );
    } catch (error) {
        console.error(`Error fetching default config for ${name}:`, error);
    }

    console.log(`Using default config for ${name}`);
    return defaults;
}

const wallpapersConfig = await loadConfig("wallpapers");