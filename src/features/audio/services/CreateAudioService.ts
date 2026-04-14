import { AudioModule, RecordingPresets } from "expo-audio";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "react-native";

class CreateAudioService {

    // instance of the service
    static instance: CreateAudioService;

    static getInstance() {
        if (!CreateAudioService.instance) {
            CreateAudioService.instance = new CreateAudioService();
        }
        return CreateAudioService.instance;
    }

    private constructor() { }

    // private method to save in device memory the recording

    private async saveRecording(recording: any) {
        try {
            const uri = recording.getURI();

            const asset = await MediaLibrary.createAssetAsync(uri);

            await MediaLibrary.createAlbumAsync('Multimedia Tracker', asset, false);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording can\'t be saved. Please try again later.');
        }
    }


    // method to create a new audio recording
    async createAudioRecording() {
        try {
            const permission = await AudioModule.requestRecordingPermissionsAsync();

            if (!permission.granted) {
                Alert.alert('The permission is denied', 'Please allow the app to access the microphone to create a recording.');
                return;
            }

            const recording = await AudioModule.Recording.createAsync({
                ...RecordingPresets.HIGH_QUALITY,
            });

            return recording;
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording can\'t be created. Please try again later.');
        }
    }

    async stopRecording(recording: any) {
        try {
            if (!recording) {
                Alert.alert('No recording', 'There is no recording to stop.');
                return;
            }
            await recording.stopAndSaveAsync();

            await this.saveRecording(recording);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'The recording can\'t be stopped. Please try again later.');
        }
    }
}

export default CreateAudioService.getInstance();