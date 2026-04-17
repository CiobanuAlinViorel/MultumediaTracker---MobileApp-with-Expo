import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecordingItem } from '../../types';
import { formatDuration } from '../hooks/useAudioUIHelper';
import PlaybackSlider from './PlaybackSlider';

type RecordsListProps = {
    visible: boolean;
    onClose: () => void;
    recordings: RecordingItem[];
    currentlyPlayingUri: string | null;
    isPlaying: boolean;
    playbackPosition: number;
    playbackDuration: number;
    onPlay: (uri: string) => void;
    onStop: () => void;
    onSeek: (seconds: number) => void;
    onDelete: (id: string) => void;
};

const RecordsList = ({
    visible,
    onClose,
    recordings,
    currentlyPlayingUri,
    isPlaying,
    playbackPosition,
    playbackDuration,
    onPlay,
    onStop,
    onSeek,
    onDelete,
}: RecordsListProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-gray-950">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
                    <Text className="text-white text-xl font-bold">My Recordings</Text>
                    <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                        <Text className="text-blue-400 text-base font-medium">Done</Text>
                    </TouchableOpacity>
                </View>

                {recordings.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-base">No recordings yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recordings}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16, gap: 12 }}
                        renderItem={({ item }) => {
                            const isActive = currentlyPlayingUri === item.uri;
                            const isCurrentlyPlaying = isActive && isPlaying;

                            return (
                                <View className="bg-gray-900 rounded-2xl p-4" style={{ gap: 12 }}>
                                    {/* Top row: info + actions */}
                                    <View className="flex-row items-center">
                                        <View className="flex-1 gap-1 mr-4">
                                            <Text
                                                className="text-white font-medium text-base"
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text className="text-gray-500 text-sm">
                                                {formatDuration(item.duration)}
                                            </Text>
                                        </View>

                                        <View className="flex-row gap-3 items-center">
                                            <TouchableOpacity
                                                onPress={() =>
                                                    isCurrentlyPlaying ? onStop() : onPlay(item.uri)
                                                }
                                                className={`px-4 py-2 rounded-xl ${isCurrentlyPlaying ? 'bg-yellow-600' : 'bg-blue-600'}`}
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-white text-sm font-semibold">
                                                    {isCurrentlyPlaying ? 'Stop' : 'Play'}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => onDelete(item.id)}
                                                className="px-4 py-2 rounded-xl bg-red-700"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-white text-sm font-semibold">
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Slider — only visible for the active track */}
                                    {isActive && (
                                        <PlaybackSlider
                                            position={playbackPosition}
                                            duration={playbackDuration > 0 ? playbackDuration : item.duration}
                                            onSeek={onSeek}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

export default RecordsList;
