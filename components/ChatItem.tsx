import {Pressable, StyleSheet} from 'react-native';
import {Text, View} from './Themed';
import React, {useContext, useEffect, useState} from "react";
import Colors from "../constants/Colors";
import {Conversation, JSONValue, Message} from "@twilio/conversations";
import {TwilioProps} from "../constants/Type";
import {Badge} from "@rneui/base";
import SekhmetAvatar from "./SekhmetAvatar";
import useAccount from "../hooks/useAccount";
import {router} from "expo-router";
import {displayConversationName, getLastMessageTime} from "../shared/conversation.utils";
import {AppContext} from "./AppContext";


export default function ChatItem({conversation, lastMessage, unreadMessagesCount}: TwilioProps) {
    const {account} = useAccount();
    const {typingStatus} = useContext(AppContext);

    const {typing, fullName} = typingStatus?.get(conversation?.sid || '') || {typing: false, fullName: ''};
    const lastMessageTime = getLastMessageTime(lastMessage);
    const onPress = async () => {
        router.push({
            pathname: "conversation",
            params: {
                uniqueName: conversation?.uniqueName,
            }
        });
    };


    return (
        <Pressable onPress={onPress} style={styles.container}>
            <SekhmetAvatar
                size={80}
                imageUrl="https://randomuser.me/api/portraits/men/36.jpg"
                icon={{
                    name: 'camera-alt',
                    type: 'material',
                    color: 'grey',
                }}
                containerStyle={{
                    borderColor: 'grey',
                    borderStyle: 'solid',
                    borderWidth: 1,
                }}
            />

            <Badge
                value={"C"}
                textStyle={styles.badgeText}
                badgeStyle={styles.badgeContainer}
            />

            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.name}>{displayConversationName(account?.id, conversation || null)}</Text>

                        <Badge
                            badgeStyle={{backgroundColor: Colors.light.online, marginBottom: 8, marginLeft: 6}}
                        />
                    </View>
                    {(unreadMessagesCount && unreadMessagesCount > 0) &&
                        <Badge
                            value={unreadMessagesCount}
                            badgeStyle={{backgroundColor: Colors.light.sekhmetGreen}}>
                        </Badge>}
                </View>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.text}>
                        {typing ? `${fullName} écrit ...` : lastMessage?.body}
                    </Text>
                    <Text style={styles.text}>{lastMessage && lastMessageTime}</Text>
                </View>

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,

    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
        marginRight: 10,
    },
    badgeContainer: {
        backgroundColor: Colors.light.sekhmetOrange,

        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        left: -20,
        top: 40,
    },
    badgeText: {
        color: 'white',
        fontSize: 12
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3,
    },
    text: {
        color: 'grey',
    }
});
