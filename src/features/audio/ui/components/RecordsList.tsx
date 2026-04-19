import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecordingItem } from '../../types';
import PlaybackSlider from './PlaybackSlider';

const PURPLE = '#6b4fa8';

type RecordsListProps = {
    visible: boolean;
    onClose: () => void;
    recordings: RecordingItem[];
    currentlyPlayingUri: string | null;
    isPlaying: boolean;
    onPlay: (uri: string) => void;
    onStop: () => void;
    onSeek: (seconds: number) => void;
    onDelete: (id: string) => void;
};

const TrashIcon = () => (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: '#888' }}>🗑</Text>
    </View>
);

const PlayIcon = ({ isPlaying }: { isPlaying: boolean }) => (
    <Text style={{ fontSize: 16, color: PURPLE, width: 20 }}>{isPlaying ? '⏸' : '▶'}</Text>
);

const RecordsList = ({
    visible,
    onClose,
    recordings,
    currentlyPlayingUri,
    isPlaying,
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a1a1a' }}>Recordings</Text>
                </View>

                {recordings.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#999', fontSize: 15 }}>No recordings yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recordings}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                            const isActive = currentlyPlayingUri === item.uri;
                            const isCurrentlyPlaying = isActive && isPlaying;

                            return (
                                <View>
                                    {index > 0 && (
                                        <View style={{ height: 1, backgroundColor: '#ebebeb', marginHorizontal: 20 }} />
                                    )}
                                    <View style={{ paddingHorizontal: 20, paddingVertical: 14, gap: 10 }}>
                                        {/* Name row */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text
                                                style={{ flex: 1, fontSize: 14, color: '#1a1a1a', fontWeight: '500', marginRight: 12 }}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={8}>
                                                <TrashIcon />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Play + Slider row */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => isCurrentlyPlaying ? onStop() : onPlay(item.uri)}
                                                hitSlop={8}
                                            >
                                                <PlayIcon isPlaying={isCurrentlyPlaying} />
                                            </TouchableOpacity>
                                            <View style={{ flex: 1 }}>
                                                <PlaybackSlider
                                                    duration={item.duration}
                                                    onSeek={onSeek}
                                                    isActive={isActive}
                                                />
                                            </View>
                                        </View>
                                    </View>
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
