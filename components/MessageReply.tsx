import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import AudioPlayer from "./media/AudioPlayer";
import {IUser} from "../shared/user.model";
import {Message} from "../constants/Type";

const blue = "#3777f0";
const grey = "lightgrey";

const MessageReply = (props:  {message: Message}) => {
    const {message: propMessage} = props;

    const [message, setMessage] = useState<Message>(propMessage);

    const [user, setUser] = useState<IUser | undefined>();
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [soundURI, setSoundURI] = useState<any>(null);

    const {width} = useWindowDimensions();

    useEffect(() => {
        setUser({
            id: 'ssss',
            login: 'ddd',
            firstName: 'dddd',
            lastName: 'qssxs',
            email: '',
            activated: true,
            langKey: '',
            authorities: [],
            createdBy: '',
            createdDate: null,
            lastModifiedBy: '',
            lastModifiedDate: null,
        });
    }, []);


    useEffect(() => {
        const checkIfMe = async () => {
            if (!user) {
                return;
            }
            const authUser = {
                id: 'ssss',
                login: 'ddd',
                firstName: 'dddd',
                lastName: 'qssxs',
                email: '',
                activated: true,
                langKey: '',
                authorities: [],
                createdBy: '',
                createdDate: null,
                lastModifiedBy: '',
                lastModifiedDate: null,
            }
            setIsMe(user.id === authUser.id);
        };
        checkIfMe();
    }, [user]);

    if (!user) {
        return <ActivityIndicator/>;
    }

    return (
        <View
            style={[
                styles.container,
                isMe ? styles.rightContainer : styles.leftContainer,
                {width: soundURI ? "75%" : "auto"},
            ]}
        >
            <View style={styles.row}>
                {soundURI && <AudioPlayer soundURI={soundURI}/>}
                {!!message.twilioMessage.body && (
                    <Text style={{color: isMe ? "black" : "white"}}>
                        {message.twilioMessage.body}
                    </Text>
                )}

               {/* {isMe && !!message.sent && (
                    <Ionicons
                        name={
                            message.received ? "checkmark" : "checkmark-done"
                        }
                        size={16}
                        color="gray"
                        style={{marginHorizontal: 5}}
                    />
                )}*/}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: "75%",
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    messageReply: {
        backgroundColor: "gray",
        padding: 5,
        borderRadius: 5,
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: "auto",
    },
    rightContainer: {
        backgroundColor: grey,
        marginLeft: "auto",
        marginRight: 10,
        alignItems: "flex-end",
    },
});

export default MessageReply;
