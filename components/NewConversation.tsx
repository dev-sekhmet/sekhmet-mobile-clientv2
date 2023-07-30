import React from "react";
import {StyleSheet} from 'react-native';
import Colors from "../constants/Colors";
import {CONVERSATION_TYPE} from "../constants/Type";
import {router} from "expo-router";
import {FAB} from "@rneui/base";

export type NewConversationParam = { conversationInfo: { label: string, type: CONVERSATION_TYPE } };
const NewConversation = ({conversationInfo}: NewConversationParam) => {
    const createNewConversation = () => {
        router.push({
            pathname: "/(main)/(tabs)/(message)/create-conversation",
            params: {
                screenTitle: conversationInfo.label,
                conversationType: conversationInfo.type
            }
        });
    }

    return <>
        <FAB
            style={styles.fab}
            size="small"
            color={Colors.light.sekhmetOrange}
            title={conversationInfo.label}
            icon={{name: "comment", color: "white"}}
            onPress={() => createNewConversation()}
        />
    </>
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});

export default NewConversation;
