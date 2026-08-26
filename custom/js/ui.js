import LZString from 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/+esm';
import { 
    baseColorInput,
    surfaceColorInput, 
    brandColorInput, 
    textColorInput, 
    textSecondaryInput, 

    websiteNameInput,
    websiteSubtextInput, 
    websiteCreatorInput,

    websiteBgInput,
    websiteFaviconInput,

    websiteURLOutput,
    visitSiteBtn
} from "./formReset.js";

const frame = document.getElementById('website-preview');
const controlForm = document.getElementById('website-config-form');

// Helper function to update link UI safely
async function updateUI() {
    const link = await makeURL();
    frame.src= link;
    websiteURLOutput.innerText = link;
    visitSiteBtn.href = link;
}

// Event listener uses async callback
controlForm.addEventListener('change', async () => {
    await updateUI();
});

// Initial load
updateUI();

async function makeURL() {
    const websiteURL = new URL(window.location.href)
    websiteURL.pathname = "/custom/website/";
    const config = {
        v: "1.0",
        bac: baseColorInput.value,
        suc: surfaceColorInput.value,
        brc: brandColorInput.value,
        tec: textColorInput.value,
        tsc: textSecondaryInput.value,

        name: websiteNameInput.value,
        subtext: websiteSubtextInput.value,
        creator: websiteCreatorInput.value,

        bgi: websiteBgInput.value,
        fai: websiteFaviconInput.value
    }
    const base64 = await packConfig(config);
    websiteURL.searchParams.set("c", base64);

    console.log("New Website URL:", websiteURL.href);
    return websiteURL;
}

export function packConfig(config) {
    const jsonString = JSON.stringify(config);
    return LZString.compressToEncodedURIComponent(jsonString);
}
export function unpackConfig(compressedUrlString) {
    if (!compressedUrlString) return null;
    const jsonString = LZString.decompressFromEncodedURIComponent(compressedUrlString);
    return JSON.parse(jsonString);
}