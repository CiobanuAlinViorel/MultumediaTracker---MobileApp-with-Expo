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
        this.stop();

        // updateInterval: 100ms gives a smooth slider
        this.player = createAudioPlayer({ uri }, { updateInterval: 100 });

        this.player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
            if (status.didJustFinish) {
                this.player = null;
                callbacks.onFinish();
            } else {
                callbacks.onStatusUpdate(status.currentTime, status.duration ?? 0);
            }
        });

        this.player.play();
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
