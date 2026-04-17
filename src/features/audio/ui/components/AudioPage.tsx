import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAudioListeners from '../hooks/useAudioListeners';
import RecordsList from './RecordsList';

const AudioPage = () => {
    const {
        isRecording,
        formattedDuration,
        isModalOpen,
        recordings,
        currentlyPlayingUri,
        isPlaying,
        playbackPosition,
        playbackDuration,
        onStartRecording,
        onStopRecording,
        onOpenModal,
        onCloseModal,
        onPlay,
        onStop,
        onSeek,
        onDelete,
    } = useAudioListeners();

    return (
        <SafeAreaView className="flex-1 bg-gray-950">
            <View className="flex-1 items-center justify-center gap-10 px-6">
                <Text className="text-white text-3xl font-bold tracking-wide">
                    Audio Recorder
                </Text>

                {/* Recording status / timer */}
                <View className="items-center gap-3 h-24 justify-center">
                    {isRecording ? (
                        <>
                            <View className="w-3 h-3 rounded-full bg-red-500" />
                            <Text className="text-red-400 text-5xl font-mono font-semibold tracking-widest">
                                {formattedDuration}
                            </Text>
                            <Text className="text-gray-400 text-sm uppercase tracking-widest">
                                Recording
                            </Text>
                        </>
                    ) : (
                        <Text className="text-gray-600 text-base">
                            Press Start to begin recording
                        </Text>
                    )}
                </View>

                {/* Record controls */}
                <View className="flex-row gap-6">
                    <TouchableOpacity
                        onPress={onStartRecording}
                        disabled={isRecording}
                        className={`px-10 py-4 rounded-full ${isRecording ? 'bg-gray-800' : 'bg-green-600'}`}
                        activeOpacity={0.7}
                    >
                        <Text className={`text-base font-semibold ${isRecording ? 'text-gray-600' : 'text-white'}`}>
                            Start
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onStopRecording}
                        disabled={!isRecording}
                        className={`px-10 py-4 rounded-full ${!isRecording ? 'bg-gray-800' : 'bg-red-600'}`}
                        activeOpacity={0.7}
                    >
                        <Text className={`text-base font-semibold ${!isRecording ? 'text-gray-600' : 'text-white'}`}>
                            Stop
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Open recordings modal */}
                {recordings.length > 0 && (
                    <TouchableOpacity
                        onPress={onOpenModal}
                        className="px-8 py-3 bg-blue-700 rounded-full"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white font-medium text-base">
                            My Recordings ({recordings.length})
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <RecordsList
                visible={isModalOpen}
                onClose={onCloseModal}
                recordings={recordings}
                currentlyPlayingUri={currentlyPlayingUri}
                isPlaying={isPlaying}
                playbackPosition={playbackPosition}
                playbackDuration={playbackDuration}
                onPlay={onPlay}
                onStop={onStop}
                onSeek={onSeek}
                onDelete={onDelete}
            />
        </SafeAreaView>
    );
};

export default AudioPage;
