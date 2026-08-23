import { 
    baseColorInput,
    surfaceColorInput, 
    brandColorInput, 
    textColorInput, 
    textSecondaryInput, 

    websiteNameInput,
    websiteSubtextInput, 
    websiteCreatorInput,

    websiteURLOutput,
    visitSiteBtn
} from "./formReset.js";

const frame = document.getElementById('website-preview');
const controlForm = document.getElementById('website-config-form');
controlForm.addEventListener('change', () => {
    frame.srcdoc = getNewFrame();

    let link = makeURL();
    websiteURLOutput.innerText = link;
visitSiteBtn.href = link;
});

let initialLink = makeURL();
websiteURLOutput.innerText = initialLink;
visitSiteBtn.href = initialLink;

frame.srcdoc = getNewFrame();

function makeURL() {
    const websiteURL = new URL(window.location.href)
    websiteURL.pathname = "/custom/website/"
    websiteURL.searchParams.set("c1", baseColorInput.value);
    websiteURL.searchParams.set("c2", surfaceColorInput.value);
    websiteURL.searchParams.set("c3", brandColorInput.value);
    websiteURL.searchParams.set("c4", textColorInput.value);
    websiteURL.searchParams.set("c5", textSecondaryInput.value);
    websiteURL.searchParams.set("name", websiteNameInput.value);
    websiteURL.searchParams.set("sub", websiteSubtextInput.value);
    websiteURL.searchParams.set("creator", websiteCreatorInput.value);

    console.log("New Website URL:", websiteURL.href);
    return websiteURL;
}

function getNewFrame() {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Website | Custom Sites</title>

    <!-- CSS -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
        :root{
            --base-color: ${baseColorInput.value};
            --surface-color: ${surfaceColorInput.value};

            --brand-color: ${brandColorInput.value};

            --text-color: ${textColorInput.value};
            --text-secondary: ${textSecondaryInput.value};
        }
        *{
            margin: 0;
            padding: 0;
        }
        body{
            background-color: var(--base-color);
            position: relative;
            min-width: 100%;
            min-height: 100vh;
            max-height: 100vh;
            overflow: hidden;
        }
        nav{
            position: absolute;
            bottom: 0rem;
            left: 50%;
            transform: translate(-50%, -50%);
            max-height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 1rem;
        }
        nav .app{
            background: color-mix(in srgb, var(--brand-color), transparent 90%);
            padding: 0.75rem;
            aspect-ratio: 1/1;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
        }
        .glow{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            aspect-ratio: 1/1;
            background: radial-gradient(color-mix(in srgb, var(--brand-color), transparent 90%), transparent);
        }
        header{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 20px;
        }
        header h1{
            font-size: min(6rem, 80vw);
            color: var(--brand-color);
            font-family: "Exo 2", Arial, Helvetica, sans-serif;
        }
        header .subtext{
            color: color-mix(in srgb, var(--text-secondary), transparent 20%);
            font-size: 1.25rem;
            font-family: "Nunito", Arial, Helvetica, sans-serif;
        }
        header .author{
            color: color-mix(in srgb, var(--text-secondary), transparent 40%);
            font-family: "Nunito", Arial, Helvetica, sans-serif;
        }
    </style>
</head>
<body>
    <div class="glow"></div>
    <nav>
        <div class="app">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
        </div>
        <div class="app">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>
        </div>
        <div class="app">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m272-440 208 120 208-120-168-97v137h-80v-137l-168 97Zm168-189v-17q-44-13-72-49.5T340-780q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-646v17l280 161q19 11 29.5 29.5T840-398v76q0 22-10.5 40.5T800-252L520-91q-19 11-40 11t-40-11L160-252q-19-11-29.5-29.5T120-322v-76q0-22 10.5-40.5T160-468l280-161Zm0 378L200-389v67l280 162 280-162v-67L520-251q-19 11-40 11t-40-11Zm82.5-486.5Q540-755 540-780t-17.5-42.5Q505-840 480-840t-42.5 17.5Q420-805 420-780t17.5 42.5Q455-720 480-720t42.5-17.5ZM480-160Z"/></svg>
        </div>
        <div class="app">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/></svg>
        </div>
        <div class="app">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm242.5-97.5Q420-475 420-500t-17.5-42.5Q385-560 360-560t-42.5 17.5Q300-525 300-500t17.5 42.5Q335-440 360-440t42.5-17.5Zm240 0Q660-475 660-500t-17.5-42.5Q625-560 600-560t-42.5 17.5Q540-525 540-500t17.5 42.5Q575-440 600-440t42.5-17.5ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z"/></svg>
        </div>
    </nav>
    <header>
        <h1>${websiteNameInput.value}</h1>
        <p class="subtext">${websiteSubtextInput.value}</p>
        <p class="author">Made by: ${websiteCreatorInput.value}</p>
    </header>
</body>
</html>
    `;
}