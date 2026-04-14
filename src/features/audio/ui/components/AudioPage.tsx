
import { Button, Text, View } from 'react-native'

type AudioPageProps = {}

const AudioPage = ({

}: AudioPageProps) => {

    return (
        <View className='h-full flex flex-col items-center justify-center gap-4'>
            <Text className='text-red-500'>Hello, let&apos;s record some audio!</Text>
            <View className='flex flex-row justify-center items-center gap-4'>
                <View>
                    <Button
                        title="Start Recording"
                        onPress={() => { }}
                        disabled={true} />
                </View>
                <View>
                    <Button
                        title="Stop Recording"
                        onPress={() => { }}
                        disabled={true} />
                </View>
            </View>
            <View>
                <Button
                    title="Play a recording"
                    onPress={() => { }}
                    disabled={true} />
            </View>
        </View>
    )
}

export default AudioPage