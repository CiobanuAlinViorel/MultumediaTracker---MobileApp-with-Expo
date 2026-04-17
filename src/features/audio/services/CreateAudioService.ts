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
        try {
            const permission = await requestRecordingPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Permission denied',
                    'Please allow the app to access the microphone to record audio.'
                );
                return;
            }

            const recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
            await recorder.prepareToRecordAsync();
            recorder.record();

            return recorder;
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording could not be started. Please try again.');
        }
    }

    public async stopRecording(recorder: any | null) {
        try {
            if (!recorder) {
                Alert.alert('No recording', 'There is no active recording to stop.');
                return;
            }

            await recorder.stop();

            // Save to media library — non-fatal, Expo Go restricts this
            const uri: string | null = recorder.uri;
            if (uri) {
                try {
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status === 'granted') {
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        await MediaLibrary.createAlbumAsync('Multimedia Tracker', asset, false);
                    }
                } catch (saveError) {
                    console.warn('Could not save to media library:', saveError);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording could not be stopped. Please try again.');
        }
    }
}

export default CreateAudioService.getInstance();
