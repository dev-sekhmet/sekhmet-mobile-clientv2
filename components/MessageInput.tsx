import React, {useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View,} from 'react-native';
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons,} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {Audio} from 'expo-av';
import AudioPlayer from './media/AudioPlayer';
import MessageBox from './MessageBox';
import {useNavigation} from '@react-navigation/core';
import Colors from "../constants/Colors";
import {Conversation} from "@twilio/conversations";
import {Message} from "../constants/Type";
import {ImagePickerResult} from "expo-image-picker/src/ImagePicker.types";
import {RecordingOptionsPresets} from "expo-av/src/Audio/RecordingConstants";
import {Composer} from "react-native-gifted-chat/lib/Composer";
import VideoPlayer from "./media/VideoPlayer";


const MessageInput = ({
                          conversation,
                          messageReplyTo,
                          removeMessageReplyTo,
                      }: {
    conversation: Conversation | null,
    messageReplyTo: Message | null,
    removeMessageReplyTo: () => void,
}) => {

    const [inputMessageText, setInputMessageText] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [soundURI, setSoundURI] = useState<string | null>(null);
    const [videoURI, setVideoURI] = useState<string | null>(null);

    const navigation = useNavigation();
    let typingTimeout: string | number | NodeJS.Timeout | undefined;

    const startTyping = () => {
        if (!conversation) {
            return;
        }
        conversation.typing();
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        typingTimeout = setTimeout(stopTyping, 1000); // Set a timeout to stop typing after 1 second of inactivity
    };

    const stopTyping = () => {
        if (!conversation) return;
        // Currently, Conversations SDK doesn't have a direct way to indicate "typing ended",
        // but it automatically stops showing a user as typing after 5 seconds without a new typing indicator.
    };
    const getRecordingPermission = async () => {

    };

    useEffect(() => {
        setupAudioMode();
        (async () => {
            if (Platform.OS !== "web") {
                const libraryResponse =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
                const audioResponse = await Audio.requestPermissionsAsync();
                if (
                    libraryResponse.status !== "granted" ||
                    audioResponse.status !== "granted" ||
                    photoResponse.status !== "granted"
                ) {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout); // Clean up on component unmount
        };

    }, []);

    const setupAudioMode = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
        } catch (error) {
            console.error('Error setting up audio mode', error);
        }
    };




    const sendMessage = async () => {
        if (!conversation || !inputMessageText.trim()) return;

        try {
            return await conversation.sendMessage(inputMessageText.trim());
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally, notify the user about the error
        }
    };


    const onPress = async () => {
        resetFields();
        let messageIndex: number | undefined ;
        if (videoURI) {
            messageIndex = await sendVideo();
        } else if (image) {
            messageIndex = await sendImage();
        } else if (soundURI) {
            messageIndex = await sendAudio();
        } else {
            messageIndex = await sendMessage();
        }

        conversation?.updateLastReadMessageIndex(messageIndex as number);
    };

    const resetFields = () => {
        setInputMessageText("");
        setImage(null);
        setProgress(0);
        setSoundURI(null);
        setVideoURI(null);
        removeMessageReplyTo();
    };

    const setImageOrVideoUri = (result: ImagePickerResult) => {
        console.log("result", result);
        if (!result.canceled) {
            var asset = result.assets[0];
            if (asset.type === 'video') {
                setVideoURI(asset.uri);
            }
            if (asset.type === 'image') {
                setImage(asset.uri);
            }
        }
    }

// Image picker
    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        setImageOrVideoUri(result);
    };

    const takeMedia = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
        });
        setImageOrVideoUri(result);
    };

    const progressCallback = (progress: {loaded: number, total: number}) => {
        setProgress(progress.loaded / progress.total);
    };

    const buildFileInfo = (fileType: string, file: string | null) => {
        const filename = file?.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        console.log("match", match);
        const type = match ? `${fileType}/${match[1]}` : `${fileType}`;
        return {filename, type};
    }

    const startRecording = async () => {
        try {
            await setupAudioMode(); // Ensure the correct audio mode is set
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(RecordingOptionsPresets.HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };


    const stopRecording = async () => {
        console.log("Stopping recording..");
        if (!recording) {
            return;
        }

        setRecording(null);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);
        if (!uri) {
            return;
        }
        setSoundURI(uri);
    }

    const sendMedia = async (mediaURI: string | null, typeMedia: string) => {
        if (!mediaURI) {
            return -1;
        }
        const fileData = new FormData();
        let {filename, type} = buildFileInfo(typeMedia, mediaURI);
        console.log("filename and type", filename, type);
        // @ts-ignore
        fileData.append(typeMedia, {uri: mediaURI, name: filename, type});
        return await conversation?.sendMessage(fileData);
    }

    const sendAudio = async () => {
        return sendMedia(soundURI, "audio");
    };


    const sendImage = async () => {
        return sendMedia(image, "image");
    };

    const sendVideo = async () => {
        return sendMedia(videoURI, "video");
    };

    return (
        <KeyboardAvoidingView
            style={[Platform.OS === "android" ?styles.root:null, {height: "auto", padding:10}]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={50}
        >
            {messageReplyTo && (
                <View
                    style={{
                        backgroundColor: "#f2f2f2",
                        padding: 5,
                        flexDirection: "row",
                        alignSelf: "stretch",
                        justifyContent: "space-between",
                    }}>
                    <View style={{flex: 1}}>
                        <Text>Reply to:</Text>
                        <MessageBox message={messageReplyTo}/>
                    </View>
                    <Pressable onPress={() => removeMessageReplyTo()}>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{margin: 5}}
                        />
                    </Pressable>
                </View>
            )}

            {(image || soundURI || videoURI) && (
                <View style={styles.sendImageContainer}>
                    {image && <Image
                        source={{uri: image}}
                        style={{width: 100, height: 100, borderRadius: 10}}
                    />}
                    {soundURI && <AudioPlayer
                        soundURI={soundURI}/>}
                    {videoURI && <VideoPlayer uri={videoURI}/>}
                    <Pressable onPress={() => {
                        setImage(null);
                        setVideoURI(null);
                        setSoundURI(null);
                    }}>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{margin: 5}}
                        />
                    </Pressable>
                </View>
            )}
            <View style={styles.row}>
                <View style={styles.inputContainer}>

                    <Composer placeholder="Votre message..."
                              textInputProps={{
                                  style: styles.input,
                                  value: inputMessageText
                              }}
                              onTextChanged={(text) => {
                                  setInputMessageText(text);
                                  startTyping();
                              }}
                              multiline={true}/>

                    <Pressable onPress={pickMedia}>
                        <Feather
                            name="image"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable onPress={takeMedia}>
                        <Feather
                            name="camera"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <MaterialCommunityIcons
                            name={recording ? "microphone" : "microphone-outline"}
                            size={24}
                            color={recording ? Colors.light.sekhmetOrange : "#595959"}
                            style={styles.icon}
                        />
                    </Pressable>
                </View>

                <Pressable onPress={onPress} style={({ pressed }) => [
                    styles.buttonContainer,
                    { opacity: pressed ? 0.7 : 1 }
                ]}>
                    {inputMessageText.trim() || image || videoURI || soundURI ? (
                        <Ionicons name="send" size={18} color={"white"}/>
                    ) : (
                        <AntDesign name="plus" size={24} color="white"/>
                    )}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        bottom: 0,
        left: 0,
        right: 0,
        position: "absolute",
    },
    row: {
        flexDirection: "row",
    },
    inputContainer: {
        backgroundColor: "#f2f2f2",
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#dedede",
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        marginHorizontal: 5,
    },
    icon: {
        marginHorizontal: 5,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: Colors.light.sekhmetGreen,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 35,
    },

    sendImageContainer: {
        bottom: 35,
        left: 0,
        right: 0,
        position: "absolute",
        flexDirection: "row",
        marginVertical: 10,
        alignSelf: "stretch",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
    },
});

export default MessageInput;
