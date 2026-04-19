import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAudioListeners from '../hooks/useAudioListeners';
import RecordsList from './RecordsList';

const PURPLE = '#6b4fa8';

const AudioPage = () => {
    const {
        isRecording,
        formattedDuration,
        isModalOpen,
        recordings,
        currentlyPlayingUri,
        isPlaying,
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f0fc' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 40, paddingHorizontal: 24 }}>
                {/* Timer */}
                <Text style={{ fontSize: 64, fontWeight: '700', color: '#2d2d2d', letterSpacing: 4, fontVariant: ['tabular-nums'] }}>
                    {isRecording ? formattedDuration.replace(':', ' : ') : '00 : 00'}
                </Text>

                {/* Record / Stop buttons */}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity
                        onPress={onStartRecording}
                        disabled={isRecording}
                        activeOpacity={0.75}
                        style={{
                            paddingHorizontal: 36,
                            paddingVertical: 14,
                            borderRadius: 999,
                            backgroundColor: isRecording ? '#d1c4e9' : PURPLE,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Record</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onStopRecording}
                        disabled={!isRecording}
                        activeOpacity={0.75}
                        style={{
                            paddingHorizontal: 36,
                            paddingVertical: 14,
                            borderRadius: 999,
                            backgroundColor: '#e0e0e0',
                            borderWidth: !isRecording ? 0 : 0,
                        }}
                    >
                        <Text style={{ color: isRecording ? '#444' : '#aaa', fontSize: 16, fontWeight: '600' }}>Stop</Text>
                    </TouchableOpacity>
                </View>

                {/* Recordings button */}
                <TouchableOpacity
                    onPress={onOpenModal}
                    activeOpacity={0.75}
                    style={{
                        paddingHorizontal: 32,
                        paddingVertical: 12,
                        borderRadius: 999,
                        borderWidth: 1.5,
                        borderColor: PURPLE,
                    }}
                >
                    <Text style={{ color: PURPLE, fontSize: 15, fontWeight: '500' }}>Recordings</Text>
                </TouchableOpacity>
            </View>

            <RecordsList
                visible={isModalOpen}
                onClose={onCloseModal}
                recordings={recordings}
                currentlyPlayingUri={currentlyPlayingUri}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onStop={onStop}
                onSeek={onSeek}
                onDelete={onDelete}
            />
        </SafeAreaView>
    );
};

export default AudioPage;
