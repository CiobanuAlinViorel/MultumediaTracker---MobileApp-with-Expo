import { useRef } from 'react';
import { PanResponder, Text, View } from 'react-native';
import { formatDuration } from '../hooks/useAudioUIHelper';

type PlaybackSliderProps = {
    position: number;   // seconds
    duration: number;   // seconds
    onSeek: (seconds: number) => void;
};

const PlaybackSlider = ({ position, duration, onSeek }: PlaybackSliderProps) => {
    const trackWidthRef = useRef(0);
    const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const x = Math.max(0, e.nativeEvent.locationX);
                onSeek(Math.min((x / trackWidthRef.current) * duration, duration));
            },
            onPanResponderMove: (e) => {
                const x = Math.max(0, e.nativeEvent.locationX);
                onSeek(Math.min((x / trackWidthRef.current) * duration, duration));
            },
        })
    ).current;

    return (
        <View style={{ gap: 6 }}>
            {/* Track */}
            <View
                {...panResponder.panHandlers}
                onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
                style={{ height: 24, justifyContent: 'center' }}
            >
                {/* Background track */}
                <View style={{ height: 4, backgroundColor: '#374151', borderRadius: 2 }}>
                    {/* Filled portion + thumb */}
                    <View
                        style={{
                            width: `${progress * 100}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            borderRadius: 2,
                        }}
                    >
                        {/* Thumb */}
                        <View
                            style={{
                                position: 'absolute',
                                right: -6,
                                top: -4,
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: '#fff',
                            }}
                        />
                    </View>
                </View>
            </View>

            {/* Time labels */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#6b7280', fontSize: 11 }}>
                    {formatDuration(Math.floor(position))}
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 11 }}>
                    {formatDuration(Math.floor(duration))}
                </Text>
            </View>
        </View>
    );
};

export default PlaybackSlider;
