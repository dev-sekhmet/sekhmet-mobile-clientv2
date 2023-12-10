import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {ResizeMode, Video} from 'expo-av';
import SekhmetActivityIndicator from "../SekhmetActivityIndicator";

const { width, height } = Dimensions.get('window');
export default function VideoPlayer({ uri = '', isCurrentUser = true }: { uri: string, isCurrentUser?: boolean }) {
    const [isLoading, setIsLoading] = useState(true);
    const playbackInstance = useRef<Video>(null);

    if (!uri) return null;

    const videoStyle = isCurrentUser ? styles.videoCurrentUser : styles.videoOtherUser;

    return (
        <View style={[styles.container, videoStyle]}>
            {isLoading && <SekhmetActivityIndicator size="small" />}
            <Video
                ref={playbackInstance}
                style={styles.video}
                useNativeControls
                source={{ uri }}
                resizeMode={ResizeMode.COVER}
                isLooping
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    video: {
        alignSelf: 'center',
        width: width * 0.8, // 80% of screen width
        height: height / 3,
    },
    videoCurrentUser: {
        alignSelf: 'flex-end',
        marginRight: 10, // Adjust margin as needed
    },
    videoOtherUser: {
        alignSelf: 'flex-start',
        marginLeft: 10, // Adjust margin as needed
    }
});
