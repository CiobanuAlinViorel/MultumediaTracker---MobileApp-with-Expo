import { createAudioPlayer, AudioStatus } from 'expo-audio';

type PlaybackCallbacks = {
    onStatusUpdate: (position: number, duration: number) => void;
    onFinish: () => void;
};

class PlayAudioService {
    static instance: PlayAudioService;
    private player: ReturnType<typeof createAudioPlayer> | null = null;

    static getInstance() {
        if (!PlayAudioService.instance) {
            PlayAudioService.instance = new PlayAudioService();
        }
        return PlayAudioService.instance;
    }

    private constructor() {}

    play(uri: string, callbacks: PlaybackCallbacks) {
        const t0 = performance.now();
        this.stop();

        // updateInterval: 100ms gives a smooth slider
        this.player = createAudioPlayer({ uri }, { updateInterval: 100 });

        let firstUpdate = true;
        this.player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
            if (firstUpdate) {
                console.log(`[timing] play first status update: ${(performance.now() - t0).toFixed(2)}ms`);
                firstUpdate = false;
            }
            if (status.didJustFinish) {
                this.player = null;
                callbacks.onFinish();
            } else {
                callbacks.onStatusUpdate(status.currentTime, status.duration ?? 0);
            }
        });

        this.player.play();
        console.log(`[timing] play() called: ${(performance.now() - t0).toFixed(2)}ms`);
    }

    pause() {
        this.player?.pause();
    }

    stop() {
        if (this.player) {
            this.player.pause();
            this.player.remove();
            this.player = null;
        }
    }

    seek(seconds: number) {
        this.player?.seekTo(seconds);
    }
}

export default PlayAudioService.getInstance();
