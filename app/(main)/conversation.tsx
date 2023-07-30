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
    const {twilioClient, typingStatus, messages: incominMessages} = useContext(AppContext);
    const { conversation, isLoading, error } = useConversation(uniqueName);
    const {account} = useAccount();

    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | undefined>(twilioClient?.user);
    const [messageReplyTo, setMessageReplyTo] = useState<Message | null>(
        null
    );
    const [refreshing, setRefreshing] = useState(false);
    const [paginator, setPaginator] = useState<Paginator<TwilioMessage> | null>(null);
    const [hasMore, setHasMore] = useState(
        false
    );
    const {typing, fullName} = typingStatus?.get(conversation?.sid || '') || {typing: false, fullName: ''};

    const navigation = useNavigation();

    async function getConversationMessages() {
        if (!twilioClient || !conversation) return;

        // Fetch messages using twilioClient and the conversation.
        let messagesPage = await conversation.getMessages(); // Assuming this method exists
        if (messagesPage && messagesPage.items) {
            setAuthorMessages(messagesPage.items);
            setPaginator(messagesPage);
            setHasMore(messagesPage.hasPrevPage);
        }
    }


    const setAuthorMessages = (msgs: TwilioMessage[]) => {
        (async () => {
            const msges = await addMessagesAuthors(msgs);
            setMessages(prev=>[...prev, ...msges]);
        })();
    }
    const addMessagesAuthors = async (items: TwilioMessage[]) => {
        return await Promise.all(items.map(async msg => {
            const user = await twilioClient?.getUser(msg.author || '')
            return {msg: msg, author: user?.friendlyName, deleted: false};
        }));
    }

    const getDate = (date: Date): string => {
        return Moment(date).calendar();
    }

    const onRefresh = async () => {
        setRefreshing(true);
        if (!paginator || !hasMore) {
            setRefreshing(false);
            return;
        }

        const result = await paginator?.prevPage();
        if (!result) {
            return;
        }
        const moreMessages = result.items;
        setPaginator(result);
        setHasMore(result.hasPrevPage);
        (async () => {
            const msges = await addMessagesAuthors(moreMessages);
            setMessages(prevMsgs => [...msges, ...prevMsgs])
        })();

        setRefreshing(false);
    };

    useEffect(() => {

        if (isLoading) {
            return;
        }


        console.log('RERUN');
        if (conversation && !messages.length) {
            getConversationMessages(); // Fetch messages once conversation is available
        }
        return () => {
        }

    }, [conversation,incominMessages, isLoading, error]);


    useEffect(() => {

        if (isLoading) {
            return;
        }

        const incoming = incominMessages?.get(conversation?.sid || '') || [];
        setAuthorMessages(incoming);
        return () => {
        }

    }, [incominMessages]);
    useEffect(() => {
        if (conversation){
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
                data={messages}
                renderItem={({item, index}) => (
                    <View>
                        <MessageBox
                            message={item}
                            authUser={twilioClient?.user}
                            setAsMessageReply={() => setMessageReplyTo(item)}
                        />
                    </View>
                )}
                keyExtractor={item => item.msg.sid}
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
