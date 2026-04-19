import * as MediaLibrary from 'expo-media-library';
import { RecordingItem } from '../types';

const AUDIO_LIBRARY_PERMISSIONS: MediaLibrary.GranularPermission[] = ['audio'];
const PAGE_SIZE = 100;
const MAX_AUDIO_FILES = 200;

class AudioLibraryService {
    static instance: AudioLibraryService;

    static getInstance() {
        if (!AudioLibraryService.instance) {
            AudioLibraryService.instance = new AudioLibraryService();
        }
        return AudioLibraryService.instance;
    }

    private constructor() { }

    public async loadAudioFiles(): Promise<RecordingItem[]> {
        const t0 = performance.now();
        try {
            const tPerm0 = performance.now();
            const permission = await MediaLibrary.requestPermissionsAsync(false, AUDIO_LIBRARY_PERMISSIONS);
            console.log(`[timing] loadAudioFiles requestPermissions: ${(performance.now() - tPerm0).toFixed(2)}ms`);

            if (!permission.granted) {
                return [];
            }

            const assets: MediaLibrary.Asset[] = [];
            let after: string | undefined;
            let hasNextPage = true;
            let page = 0;

            while (hasNextPage && assets.length < MAX_AUDIO_FILES) {
                const tPage0 = performance.now();
                const result = await MediaLibrary.getAssetsAsync({
                    first: PAGE_SIZE,
                    after,
                    mediaType: MediaLibrary.MediaType.audio,
                    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
                });
                console.log(`[timing] getAssetsAsync page ${page} (${result.assets.length} assets): ${(performance.now() - tPage0).toFixed(2)}ms`);

                assets.push(...result.assets);
                hasNextPage = result.hasNextPage;
                after = result.endCursor;
                page++;
            }

            // Map and sort the results by creation date (newest first)
            const mapped = assets
                .slice(0, MAX_AUDIO_FILES)
                .map((asset) => ({
                    id: asset.id,
                    name: asset.filename,
                    uri: asset.uri,
                    duration: Math.round(asset.duration ?? 0),
                    createdAt: asset.creationTime || asset.modificationTime || Date.now(),
                })).sort((a, b) => b.createdAt - a.createdAt);

            console.log(`[timing] loadAudioFiles total (${mapped.length} files): ${(performance.now() - t0).toFixed(2)}ms`);
            return mapped;
        } catch (error) {
            console.warn('Could not load audio files from the media library:', error);
            return [];
        }
    }
}

export default AudioLibraryService.getInstance();
