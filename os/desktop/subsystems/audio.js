import { SystemLogger } from "../../system/logger.js";
import { normalizePath, onModpackChange } from "../modpackMgr.js";

const audioLogger = new SystemLogger("Audio Subsystem");

audioLogger.log("System initialized", "Module Loaded and Initialized");

// ! WHEN USEFULL THING IS UPDATED
onModpackChange(async (e) => {
    // send initial update
    audioLogger.log("Audio Source Updated", "Changed audio source");

    // get pack and manifest
    const {pack, manifest} = e.detail;

    // check
    if (!pack || !manifest) {
        audioLogger.error("Invalid Audio Source", "The audio source is either missing or invalid")
        return;
    }

    // use the audio
    if (manifest.backgroundAudio) {
        const blobs = [];

        for (const audio of manifest.backgroundAudio) {

            // get blob
            const path = normalizePath(audio.file);
            const audioBlob = pack.get(path);

            // another check
            if (!audioBlob) {
                audioLogger.error("Source not found", `the audio source ${audio.name} was not found`);
                continue;
            }

            // add to array
            blobs.push(audioBlob);
        }
        audioLogger.log("Audio Loaded", `Successfully loaded ${blobs.length} audio files`);

        backgroundAudioPlayer.setTracks(blobs);
        await backgroundAudioPlayer.play();
    }
});

// ! BLOB AUDIO PLAYER
class BlobAudioPlayer {
    constructor(blobs = []) {
        this.blobs = blobs;
        this.index = 0;
        this.audio = null;
        this.url = null;
    }

    // * PLAY
    async play() {
        if (this.blobs.length === 0) {
            return;
        }

        this.cleanup();
        const blob = this.blobs[this.index];

        this.url =URL.createObjectURL(blob);
        this.audio = new Audio(this.url);

        this.audio.addEventListener("ended", () => {
            this.next();
        });

        await this.audio.play();
    }

    // * NEXT
    async next() {
        if (this.blobs.length === 0) {
            return;
        }
        this.index = (this.index + 1) % this.blobs.length;
        await this.play();
    }

    // * PREVIOUS
    async previous() {
        if (this.blobs.length === 0) {
            return;
        }
        this.index = (this.index - 1 + this.blobs.length) % this.blobs.length;
        await this.play();
    }

    // * PAUSE
    pause() {
        if (this.audio) {
            this.audio.pause();
        }

        audioLogger.log("Audio Stopped", "background audio has been paused");
    }

    // * RESUME
    async resume() {
        if (this.audio) {
            await this.audio.play();
        }

        audioLogger.log("Audio Resumed", "background audio has been resumed");
    }

    // * CLEANUP
    cleanup() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = "";
            this.audio = null;
        }
        if (this.url) {
            URL.revokeObjectURL(this.url);
            this.url = null;
        }
    }

    // * SET TRACKS
    setTracks(blobs) {
        this.cleanup();
        this.blobs = blobs;
        this.index = 0;
    }

    // * GET CURRENT
    getCurrentIndex() {
        return this.index;
    }
    getCurrentBlob() {
        if (this.blobs.length === 0) {
            return null;
        }
        return this.blobs[this.index];
    }
}

export const backgroundAudioPlayer = new BlobAudioPlayer();