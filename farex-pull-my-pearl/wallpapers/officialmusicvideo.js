let videoElement = null;
let videoUrl = null;

export const DefaultWallpaper = {
    init(api) {
        // Use your custom log function from the API
        api.log("Initializing video wallpaper...");

        // Use the new getAssetUrl API function directly!
        videoUrl = api.getAssetUrl('assets/officialmusicvideo.mp4', 'video/mp4');

        if (!videoUrl) {
            console.error("Video asset not found in modpack!");
            return;
        }

        // Create HTML5 Video Element
        videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsInline = true;

        videoElement.play().catch(err => console.error("Autoplay error:", err));
    },

    render(ctx, api, time, dt) {
        if (videoElement && videoElement.readyState >= 2) {
            ctx.drawImage(videoElement, 0, 0, api.width, api.height);
        }
    },

    destroy() {
        if (videoElement) {
            videoElement.pause();
            videoElement.removeAttribute('src');
            videoElement.load();
            videoElement = null;
        }
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            videoUrl = null;
        }
    }
};

export default DefaultWallpaper;