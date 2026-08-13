import { ZipWriter, ZipReader, BlobWriter, BlobReader } from "https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.34/+esm";

// * Pack info
export let currentPack = new Map();
export let currentManifest = null;

// ! CREATE QPACK
/**
 * Creates a qpack blob promise object
 *
 * @export
 * @async
 * @param {files} files 
 * @returns {unknown} 
 */
export async function createQpack(files) {
    const writer = new ZipWriter(
        new BlobWriter("application/zip")
    );

    for (const file of files) {
        const path = file.webkitRelativePath
            .split("/")
            .slice(1)
            .join("/");

        await writer.add(
            path,
            new BlobReader(file)
        );
    }

    return await writer.close();
}

// ! DOWNLOAD QPACK
/**
 * Downloads a .qpack compressed file
 *
 * @export
 * @param {*} qpack 
 * @param {string} [filename="modpack.qpack"] 
 */
export function downloadQpack(qpack, filename = "modpack.qpack") {
    const url = URL.createObjectURL(qpack);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

// ! EXTRACT QPACK
/**
 * Extracted the contents od a .qpack file
 *
 * @export
 * @async
 * @param {*} qpack 
 * @returns {unknown} 
 */
export async function extractQpack(qpack) {
    const reader = new ZipReader(
        new BlobReader(qpack)
    );

    const entries = await reader.getEntries();

    const files = [];

    for (const entry of entries) {
        if (entry.directory) {
            continue;
        }

        const blob = await entry.getData(
            new BlobWriter()
        );

        files.push({
            name: entry.filename,
            blob
        });
    }

    await reader.close();

    return files;
}

// ! LOAD QPACK
/**
 * Loads a qpack as the new system default
 *
 * @export
 * @async
 * @param {*} qpack 
 * @returns {unknown} 
 */
export async function loadQpack(qpack) {

    const files =
        await extractQpack(qpack);

    const pack =
        new Map();

    for (const file of files) {
        pack.set(
            file.name,
            file.blob
        );
    }

    const manifestFile =
        pack.get("manifest.json");

    if (!manifestFile) {
        throw new Error(
            "QPack is missing manifest.json"
        );
    }

    const manifestText =
        await manifestFile.text();

    const manifest =
        JSON.parse(manifestText);


    currentPack = pack;
    currentManifest = manifest;

    console.log("[QOS Modpack]: Pack loaded");
    console.log("[QOS Modpack]:", manifest);

    modpackEvents.dispatchEvent(
        new CustomEvent("change", {
            detail: {
                pack: currentPack,
                manifest: currentManifest
            }
        })
    );

    return {
        pack,
        manifest
    };
}

// * MODPACK EVENT LISTENER
const modpackEvents = new EventTarget();

export function onModpackChange(callback) {
    modpackEvents.addEventListener("change", callback);

    return () => {
        modpackEvents.removeEventListener("change", callback);
    };
}

// * HELPERS
// normalizer path
export function normalizePath(path) {
    return path.replace(/^\.\/+/, "");
}