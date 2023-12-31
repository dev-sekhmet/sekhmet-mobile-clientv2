import { Feather } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import SekhmetActivityIndicator from "../SekhmetActivityIndicator";

const AudioPlayer = ({ soundURI }:{ soundURI: string | null}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [paused, setPause] = useState(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        loadSound();
        return () => {
            // unload sound
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [soundURI]);


    const loadSound = async () => {
        if (!soundURI) {
            return;
        }
        if (sound) {
            await sound.unloadAsync();
        }

        const { sound: soundAudio } = await Audio.Sound.createAsync(
            { uri: soundURI },
            {},
            onPlaybackStatusUpdate
        );
        setSound(soundAudio);
    };

    // Audio
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            return;
        }
        setAudioProgress(status.positionMillis / (status.durationMillis || 1));
        setPause(!status.isPlaying);
        setAudioDuration(status.durationMillis || 0);
    };

    const playPauseSound = async () => {
        if (!sound) {
            return;
        }
        if (paused) {
            await sound.playFromPositionAsync(0);
        } else {
            await sound.pauseAsync();
        }
    };

    const getDuration = () => {
        const minutes = Math.floor(audioDuration / (60 * 1000));
        const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <View style={styles.sendAudioContainer}>
            {sound && <><Pressable onPress={playPauseSound}>
                <Feather name={paused ? "play" : "pause"} size={24} color="gray"/>
            </Pressable>

                <View style={styles.audiProgressBG}>
                    <View
                        style={[styles.audioProgressFG, { left: `${audioProgress * 100}%` }]}
                    />
                </View>

                <Text>{getDuration()}</Text></>}
            {!sound && <SekhmetActivityIndicator size="small" />}
        </View>
    );
};

const styles = StyleSheet.create({
    sendAudioContainer: {
        marginVertical: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        backgroundColor: 'transparent',
    },

    audiProgressBG: {
        height: 3,
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 5,
        margin: 10,
    },
    audioProgressFG: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#3777f0",

        position: "absolute",
        top: -3,
    },
});

export default AudioPlayer;
