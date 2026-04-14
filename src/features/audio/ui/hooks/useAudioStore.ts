import { create } from 'zustand';
import { RecordingItem } from '../../types';

interface AudioState {
    recordings: RecordingItem[];
    currentlyPlayingUri: string | null;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    addRecording: (recording: RecordingItem) => void;
    deleteRecording: (id: string) => void;
    setCurrentlyPlayingUri: (uri: string | null) => void;
}

const useAudioStore = create<AudioState>(
    (set) => ({
        recordings: [],
        currentlyPlayingUri: null,
        isPlaying: false,
        setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
        addRecording: (recording: RecordingItem) =>
            set((state) => ({ recordings: [...state.recordings, recording] })),
        deleteRecording: (id: string) =>
            set((state) => ({
                recordings: state.recordings.filter((rec) => rec.id !== id),
            })),
        setCurrentlyPlayingUri: (uri: string | null) => set({ currentlyPlayingUri: uri }),
    })
);

export default useAudioStore;
