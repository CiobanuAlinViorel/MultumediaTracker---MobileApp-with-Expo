import { useCallback, useEffect, useRef } from 'react';
import { setAudioModeAsync } from 'expo-audio';
import * as MediaLibrary from 'expo-media-library';
import useAudioActions from './useAudioActions';
import useAudioStore from './useAudioStore';
import { formatDuration } from './useAudioUIHelper';
import PlayAudioService from '../../services/PlayAudioService';
import AudioLibraryService from '../../services/AudioLibraryService';

export default function useAudioListeners() {
    const {
        currentRecording,
        setCurrentRecording,
        addRecording,
        deleteRecording,
        isRecording,
        setIsRecording,
        recordingDuration,
        setRecordingDuration,
        isModalOpen,
        setIsModalOpen,
        currentlyPlayingUri,
        setCurrentlyPlayingUri,
        isPlaying,
        setIsPlaying,
        recordings,
        setRecordings,
        playbackPosition,
        playbackDuration,
        setPlaybackPosition,
        setPlaybackDuration,
    } = useAudioStore();

    const { createAudioRecording, stopRecording } = useAudioActions({ recording: currentRecording });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const durationRef = useRef(0);

    // Configure audio session once on mount so sound plays on silent mode (iOS)
    useEffect(() => {
        setAudioModeAsync({ playsInSilentMode: true }).catch(console.warn);
    }, []);

    const hydrateRecordings = useCallback(async () => {
        const deviceRecordings = await AudioLibraryService.loadAudioFiles();
        setRecordings(deviceRecordings);
    }, [setRecordings]);

    useEffect(() => {
        void hydrateRecordings();
    }, [hydrateRecordings]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            PlayAudioService.stop();
        };
    }, []);

    const onStartRecording = useCallback(async () => {
        const recording = await createAudioRecording();
        if (!recording) return;

        durationRef.current = 0;
        setCurrentRecording(recording);
        setIsRecording(true);
        setRecordingDuration(0);

        timerRef.current = setInterval(() => {
            durationRef.current += 1;
            setRecordingDuration(durationRef.current);
        }, 1000);
    }, [createAudioRecording, setCurrentRecording, setIsRecording, setRecordingDuration]);

    const onStopRecording = useCallback(async () => {
        if (!currentRecording) return;

        const duration = durationRef.current;

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        try {
            await stopRecording();

            const uri: string | null = currentRecording.uri;
            if (uri) {
                addRecording({
                    id: Date.now().toString(),
                    name: `Recording ${new Date().toLocaleTimeString()}`,
                    uri,
                    duration,
                    createdAt: Date.now(),
                });
            }
        } finally {
            setCurrentRecording(null);
            setIsRecording(false);
            setRecordingDuration(0);
            durationRef.current = 0;
        }
    }, [currentRecording, stopRecording, addRecording, setCurrentRecording, setIsRecording, setRecordingDuration]);

    const onOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen]);

    const onCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    const resetPlayback = useCallback(() => {
        setCurrentlyPlayingUri(null);
        setIsPlaying(false);
        setPlaybackPosition(0);
        setPlaybackDuration(0);
    }, [setCurrentlyPlayingUri, setIsPlaying, setPlaybackPosition, setPlaybackDuration]);

    const onPlay = useCallback((uri: string) => {
        if (currentlyPlayingUri === uri && isPlaying) {
            PlayAudioService.pause();
            resetPlayback();
            return;
        }

        setCurrentlyPlayingUri(uri);
        setIsPlaying(true);
        setPlaybackPosition(0);

        PlayAudioService.play(uri, {
            onStatusUpdate: (position, duration) => {
                setPlaybackPosition(position);
                setPlaybackDuration(duration);
            },
            onFinish: resetPlayback,
        });
    }, [currentlyPlayingUri, isPlaying, resetPlayback, setCurrentlyPlayingUri, setIsPlaying, setPlaybackPosition, setPlaybackDuration]);

    const onStop = useCallback(() => {
        PlayAudioService.stop();
        resetPlayback();
    }, [resetPlayback]);

    const onSeek = useCallback((seconds: number) => {
        PlayAudioService.seek(seconds);
        setPlaybackPosition(seconds);
    }, [setPlaybackPosition]);

    const onDelete = useCallback(async (id: string) => {
        const target = recordings.find((r) => r.id === id);
        if (target && target.uri === currentlyPlayingUri) {
            onStop();
        }
        deleteRecording(id);
        if (target) {
            await MediaLibrary.deleteAssetsAsync([target.id]).catch(console.warn);
        }
    }, [recordings, currentlyPlayingUri, deleteRecording, onStop]);

    return {
        // State
        isRecording,
        recordingDuration,
        formattedDuration: formatDuration(recordingDuration),
        isModalOpen,
        recordings,
        currentlyPlayingUri,
        isPlaying,
        playbackPosition,
        playbackDuration,
        // Handlers
        onStartRecording,
        onStopRecording,
        onOpenModal,
        onCloseModal,
        onPlay,
        onStop,
        onSeek,
        onDelete,
    };
}
