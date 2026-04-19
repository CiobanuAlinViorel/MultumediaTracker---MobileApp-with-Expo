import { AudioModule, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

class CreateAudioService {

    static instance: CreateAudioService;

    static getInstance() {
        if (!CreateAudioService.instance) {
            CreateAudioService.instance = new CreateAudioService();
        }
        return CreateAudioService.instance;
    }

    private constructor() { }

    public async createAudioRecording() {
        const t0 = performance.now();
        try {
            const tPerm0 = performance.now();
            const permission = await requestRecordingPermissionsAsync();
            console.log(`[timing] requestRecordingPermissions: ${(performance.now() - tPerm0).toFixed(2)}ms`);

            if (!permission.granted) {
                Alert.alert(
                    'Permission denied',
                    'Please allow the app to access the microphone to record audio.'
                );
                return;
            }

            const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);

            const tPrep0 = performance.now();
            await recorder.prepareToRecordAsync();
            console.log(`[timing] prepareToRecordAsync: ${(performance.now() - tPrep0).toFixed(2)}ms`);

            recorder.record();
            console.log(`[timing] createAudioRecording total: ${(performance.now() - t0).toFixed(2)}ms`);

            return recorder;
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording could not be started. Please try again.');
        }
    }

    public async stopRecording(recorder: any | null) {
        const t0 = performance.now();
        try {
            if (!recorder) {
                Alert.alert('No recording', 'There is no active recording to stop.');
                return;
            }

            const tStop0 = performance.now();
            await recorder.stop();
            console.log(`[timing] recorder.stop: ${(performance.now() - tStop0).toFixed(2)}ms`);

            // Save to media library — non-fatal, Expo Go restricts this
            const uri: string | null = recorder.uri;
            if (uri) {
                try {
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status === 'granted') {
                        const tSave0 = performance.now();
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        console.log(`[timing] createAssetAsync: ${(performance.now() - tSave0).toFixed(2)}ms`);

                        const tAlbum0 = performance.now();
                        await MediaLibrary.createAlbumAsync('Multimedia Tracker', asset, false);
                        console.log(`[timing] createAlbumAsync: ${(performance.now() - tAlbum0).toFixed(2)}ms`);
                    }
                } catch (saveError) {
                    console.warn('Could not save to media library:', saveError);
                }
            }

            console.log(`[timing] stopRecording total: ${(performance.now() - t0).toFixed(2)}ms`);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording could not be stopped. Please try again.');
        }
    }
}

export default CreateAudioService.getInstance();
