import { create } from 'zustand';
import { RecordingItem } from '../../types';

interface AudioState {
    recordings: RecordingItem[];
    currentRecording: any | null;
    currentlyPlayingUri: string | null;
    isPlaying: boolean;
    isRecording: boolean;
    recordingDuration: number;
    isModalOpen: boolean;
    playbackPosition: number;   // seconds
    playbackDuration: number;   // seconds
    setIsPlaying: (isPlaying: boolean) => void;
    setIsRecording: (isRecording: boolean) => void;
    setRecordingDuration: (duration: number) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setPlaybackPosition: (position: number) => void;
    setPlaybackDuration: (duration: number) => void;
    addRecording: (recording: RecordingItem) => void;
    deleteRecording: (id: string) => void;
    setCurrentRecording: (recording: any | null) => void;
    setCurrentlyPlayingUri: (uri: string | null) => void;
}

const useAudioStore = create<AudioState>((set) => ({
    recordings: [],
    currentlyPlayingUri: null,
    currentRecording: null,
    isPlaying: false,
    isRecording: false,
    recordingDuration: 0,
    isModalOpen: false,
    playbackPosition: 0,
    playbackDuration: 0,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsRecording: (isRecording) => set({ isRecording }),
    setRecordingDuration: (recordingDuration) => set({ recordingDuration }),
    setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
    setPlaybackPosition: (playbackPosition) => set({ playbackPosition }),
    setPlaybackDuration: (playbackDuration) => set({ playbackDuration }),
    addRecording: (recording) =>
        set((state) => ({ recordings: [...state.recordings, recording] })),
    deleteRecording: (id) =>
        set((state) => ({
            recordings: state.recordings.filter((rec) => rec.id !== id),
        })),
    setCurrentlyPlayingUri: (currentlyPlayingUri) => set({ currentlyPlayingUri }),
    setCurrentRecording: (currentRecording) => set({ currentRecording }),
}));

export default useAudioStore;
