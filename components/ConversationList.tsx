import {Conversation} from "@twilio/conversations";
import * as React from "react";
import {useContext, useEffect} from "react";
import {AppContext} from "./AppContext";
import SekhmetActivityIndicator from "./SekhmetActivityIndicator";
import {View} from "./Themed";
import {Dimensions, FlatList, StyleSheet} from "react-native";
import ChatItem from "./ChatItem";
import NewConversation, {ConversationInfo} from "./NewConversation";


const   ConversationList = ({conversations, onScroll, loadingConversations, conversationInfo}: {
    conversations?: Conversation[],
    onScroll: any,
    loadingConversations?: boolean,
     conversationInfo: ConversationInfo
}) => {
    const context = useContext(AppContext);

     useEffect(() => {
         if (loadingConversations) {
             return;
         }
     }, [loadingConversations]);


    if (!context || loadingConversations) {
        return <SekhmetActivityIndicator/>
    }
    const {
        messages,
    } = context;

    const getLastMessage = (conversationSid: string) => {
        const conversationMessages = messages?.get(conversationSid);
        if (conversationMessages && conversationMessages.length > 0) {
            return conversationMessages[conversationMessages.length-1];
        }
        return undefined;
    }
    return <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => {
                const unreadMessagesCount = 2;
                const lastMessage = getLastMessage(item.sid);
                return (
                    <ChatItem
                        key={item.sid}
                        conversation={item}
                        lastMessage={lastMessage}
                        unreadMessagesCount={unreadMessagesCount}/>
                );
            }}
            onEndReached={onScroll}
            onEndReachedThreshold={0.2}
            keyExtractor={item => item.sid}
        />
        <NewConversation conversationInfo={conversationInfo}/>
    </View>
}
export  default ConversationList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:  Dimensions.get('screen').height
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 120,
        alignItems: 'center',
    }
});
