import { SystemLogger } from "../../../system/logger.js";
import { normalizePath, onModpackChange } from "../../modpackMgr.js";
import { API, setWallpaper } from "./wallpaper.js";

const logger = new SystemLogger("Wallpaper Modpack Subsystem");
logger.log("Subsystem Initialized", "Module Loaded and Intialized");

onModpackChange(async (e) => {
    const { pack, manifest } = e.detail;

    // ! HANDLE DEFAULT WALLPAPER
    if (manifest.defaultWallpaper) {
        const rawBlob = pack.get(normalizePath(manifest.defaultWallpaper));

        if (!rawBlob) {
            logger.error("Asset Missing", `Default wallpaper file not found at location ${manifest.defaultWallpaper}`);
            return;
        }

        // Create the JS blob
        const jsBlob = new Blob([rawBlob], { type: "text/javascript" });
        const objectUrl = URL.createObjectURL(jsBlob);

        // Attempt to load
        try {
            const module = await import(objectUrl);
            const wallpaper = module.default || module;

            let newAPI = {
                ...API,
                getFile(filePath) {
                    return pack.get(normalizePath(filePath));
                },
                getAssetUrl(filePath, mimeType = "") {
                    const blob = pack.get(normalizePath(filePath));
                    if (!blob) return null;
            
                    const typedBlob = mimeType
                    ? new Blob([blob], { type: mimeType })
                    : blob;
                    return URL.createObjectURL(typedBlob);
                },
                log(msg) {
                    console.log(`[Modpack Wallpaper]:`, msg);
                },
                async getTextFile(filePath) {
                    const blob = pack.get(normalizePath(filePath));
                    if (!blob) return null;
                    return await blob.text();
                },
            }
            
            wallpaper.init(newAPI);

            setWallpaper(wallpaper, false);

        } catch (err) {
            logger.error("Failed to load wallpaper module", err);
        } finally {
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        }
  }
});