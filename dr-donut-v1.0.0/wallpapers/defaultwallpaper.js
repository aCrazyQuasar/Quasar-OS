let farexPullMyPearl = null;
let wizoxBanThisGuy = null;
let farexURL = null;
let wizoxURL = null;
let currentVideo = null;

export const DefaultWallpaper = {
    init(api) {
        api.log("Initializing video wallpaper...");
        
        let farexURL = api.getAssetUrl('assets/farex-pull-my-pearl.mp4', 'video/mp4');
        let wizoxURL = api.getAssetUrl('assets/wizox-ban-this-guy.mp4', 'video/mp4');

        if (!farexURL || !wizoxURL) {
            api.log("One or more video assets failed to load");
        }

        // Setup Video 1
        farexPullMyPearl = document.createElement('video');
        farexPullMyPearl.src = farexURL;
        farexPullMyPearl.muted = true;
        farexPullMyPearl.playsInline = true;
        farexPullMyPearl.addEventListener("ended", () => {
            farexPullMyPearl.pause();
            currentVideo = wizoxBanThisGuy;
            wizoxBanThisGuy.currentTime = 0;
            wizoxBanThisGuy.play().catch(err => console.error(err));
        });

        // Setup Video 2
        wizoxBanThisGuy = document.createElement('video');
        wizoxBanThisGuy.src = wizoxURL;
        wizoxBanThisGuy.muted = true;
        wizoxBanThisGuy.playsInline = true;
        wizoxBanThisGuy.addEventListener("ended", () => {
            wizoxBanThisGuy.pause();
            currentVideo = farexPullMyPearl;
            farexPullMyPearl.currentTime = 0;
            farexPullMyPearl.play().catch(err => console.error(err));
        });

        currentVideo = farexPullMyPearl;
        currentVideo.play();
    },

    render(ctx, api, time, dt) {
        if (currentVideo && currentVideo.readyState >= 2) {
            ctx.drawImage(currentVideo, 0, 0, api.width, api.height);
        }
    },

    destroy() {
        farexPullMyPearl.pause();
        farexPullMyPearl.removeAttribute('src');
        farexPullMyPearl.load();
        farexPullMyPearl = null;

        wizoxBanThisGuy.pause();
        wizoxBanThisGuy.removeAttribute('src');
        wizoxBanThisGuy.load();
        wizoxBanThisGuy = null;

        URL.revokeObjectURL(farexURL);
        farexURL = null;

        URL.revokeObjectURL(wizoxURL);
        wizoxURL = null;
    }
};

export default DefaultWallpaper;