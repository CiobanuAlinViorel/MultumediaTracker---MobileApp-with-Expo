import CreateAudioService from "../../services/CreateAudioService";


export default function useAudioActions({ recording }: { recording: any }) {
    const createAudioRecording = async () => {
        return await CreateAudioService.createAudioRecording();
    }
    const stopRecording = async () => {
        return await CreateAudioService.stopRecording(recording);
    }
    return {
        createAudioRecording,
        stopRecording
    }
}