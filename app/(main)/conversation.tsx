import {FlatList, RefreshControl, SafeAreaView, StyleSheet} from 'react-native';
import {View, Text} from '../../components/Themed';
import {Stack, useLocalSearchParams,useNavigation} from "expo-router";
import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../components/AppContext";
import useConversation from "../../hooks/useConversation";
import SekhmetActivityIndicator from "../../components/SekhmetActivityIndicator";
import {displayConversationName} from "../../shared/conversation.utils";
import {Conversation, Message as TwilioMessage, Paginator, User} from "@twilio/conversations";
import useAccount from "../../hooks/useAccount";
import 'moment/locale/fr'
import Moment from "moment";
import {Message} from "../../constants/Type";
import MessageBox from "../../components/MessageBox";
import MessageInput from "../../components/MessageInput";


function HeaderTitle({ title, typing }:{ title:string, typing :boolean}) {
    return (
        <View>
            <Text style={styles.titleText}>{title}</Text>
            {typing && <Text>écrit ...</Text>}
        </View>
    );
}

const ConversationSrreen = () => {
    const {uniqueName} = useLocalSearchParams<any>();
    const {
        twilioClient,
        typingStatus,
        messages,
        fetchMoreMessages,
        messagePaginator,
    } = useContext(AppContext);

    const { conversation, isLoading, error } = useConversation(uniqueName);
    const conversationMessages = messages?.get(conversation?.sid || '') || [];
    const {account} = useAccount();
    const [user, setUser] = useState<User | undefined>(twilioClient?.user);
    const [messageReplyTo, setMessageReplyTo] = useState<Message | null>(
        null
    );
    const [messagesAuthor, setMessagesAuthor] = useState<Message[]>([]);

    const [refreshing, setRefreshing] = useState(false);
    const {typing, fullName} = typingStatus?.get(conversation?.sid || '') || {typing: false, fullName: ''};

    const navigation = useNavigation();


    const addMessagesAuthors = async (items: TwilioMessage[]) => {
        const messagesWithAuthors = await Promise.all(items.map(async twilioMessage => {
            const user = await twilioClient?.getUser(twilioMessage.author || '');
            return { twilioMessage, author: user?.friendlyName, deleted: false };
        }));

        setMessagesAuthor(messagesWithAuthors);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (fetchMoreMessages) {
            await fetchMoreMessages(conversation?.sid || '');
        }
        setRefreshing(false);
    };


    useEffect(() => {
        if (conversation) {
            navigation.setOptions({
                headerTitle: () => (
                    <HeaderTitle
                        title={displayConversationName(account?.id, conversation)}
                        typing={typing}
                    />
                )
            });
        }
    }, [typing, conversation, account]);

    useEffect(() => {
        if (conversationMessages.length > 0) {
            addMessagesAuthors(conversationMessages);
        }
    }, [conversationMessages]);


    if (isLoading) {
        return <SekhmetActivityIndicator/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                data={messagesAuthor}
                renderItem={({item, index}) => (
                    <View>
                        <MessageBox
                            message={item}
                            authUser={twilioClient?.user}
                            setAsMessageReply={() => setMessageReplyTo(item)}
                        />
                    </View>
                )}
                keyExtractor={item => item.twilioMessage.sid}
            />
            <MessageInput
                conversation={conversation}
                messageReplyTo={messageReplyTo}
                removeMessageReplyTo={() => setMessageReplyTo(null)}
            />
        </SafeAreaView>
    );
}

const MemoizedConversationScreen = React.memo(ConversationSrreen);
export default MemoizedConversationScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 20,  // adjust the size as needed
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
