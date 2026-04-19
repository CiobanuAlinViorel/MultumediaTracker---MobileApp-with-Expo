import { useRef } from 'react';
import { PanResponder, View } from 'react-native';
import useAudioStore from '../hooks/useAudioStore';

type PlaybackSliderProps = {
    duration: number;
    onSeek: (seconds: number) => void;
    isActive: boolean;
};

const PlaybackSlider = ({ duration: itemDuration, onSeek, isActive }: PlaybackSliderProps) => {
    const playbackPosition = useAudioStore((s) => s.playbackPosition);
    const playbackDuration = useAudioStore((s) => s.playbackDuration);

    const duration = isActive && playbackDuration > 0 ? playbackDuration : itemDuration;
    const position = isActive ? playbackPosition : 0;

    const trackWidthRef = useRef(0);
    const durationRef = useRef(duration);
    durationRef.current = duration;

    const onSeekRef = useRef(onSeek);
    onSeekRef.current = onSeek;

    const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const x = Math.max(0, e.nativeEvent.locationX);
                onSeekRef.current(Math.min((x / trackWidthRef.current) * durationRef.current, durationRef.current));
            },
            onPanResponderMove: (e) => {
                const x = Math.max(0, e.nativeEvent.locationX);
                onSeekRef.current(Math.min((x / trackWidthRef.current) * durationRef.current, durationRef.current));
            },
        })
    ).current;

    return (
        <View
            {...panResponder.panHandlers}
            onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
            style={{ height: 24, justifyContent: 'center' }}
        >
            <View style={{ height: 3, backgroundColor: '#ddd', borderRadius: 2 }}>
                <View
                    style={{
                        width: `${progress * 100}%`,
                        height: '100%',
                        backgroundColor: '#6b4fa8',
                        borderRadius: 2,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            right: -6,
                            top: -4.5,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: '#6b4fa8',
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

export default PlaybackSlider;
