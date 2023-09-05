import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {Text, View} from '../../components/Themed';
import {useLocalSearchParams, useNavigation} from "expo-router";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../components/AppContext";
import useConversation from "../../hooks/useConversation";
import SekhmetActivityIndicator from "../../components/SekhmetActivityIndicator";
import {displayConversationName} from "../../shared/conversation.utils";
import {Message as TwilioMessage, User} from "@twilio/conversations";
import useAccount from "../../hooks/useAccount";
import 'moment/locale/fr'
import {Message} from "../../constants/Type";
import Moment from "moment/moment";
import {GiftedChat, IMessage} from "react-native-gifted-chat";
import 'dayjs/locale/fr'


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
    const flatListRef = useRef<FlatList>(null);



    const addMessagesAuthors = async (items: TwilioMessage[]) => {
        const messagesWithAuthors = await Promise.all(items.map(async twilioMessage => {
            const user = await twilioClient?.getUser(twilioMessage.author || '');
            return { twilioMessage, author: user, deleted: false };
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

    const needsDateDivider = (index: number, messages: Message[]): boolean => {
        if (index === 0) return true;
        const currentDate = Moment(messages[index].twilioMessage.dateUpdated || undefined);
        const previousDate = Moment(messages[index - 1].twilioMessage.dateUpdated || undefined);
        return !currentDate.isSame(previousDate, 'day');
    }


    if (isLoading) {
        return <SekhmetActivityIndicator/>;
    }

    const onSend = (messages: IMessage[]) => {

    }

    return (
        <SafeAreaView style={styles.container}>
            <GiftedChat
                messages={messagesAuthor.map(mgs => {
                    return {
                        _id: mgs.twilioMessage.sid,
                        text: mgs.twilioMessage.body || '',
                        createdAt: mgs.twilioMessage.dateCreated || 1,
                        user: {
                            _id: mgs.author?.identity || '',
                            name: mgs.author?.friendlyName  || '',
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                    }
                })}
                infiniteScroll={true}
                onLoadEarlier={()=>onRefresh()}
                loadEarlier={true}
                locale='fr'
                renderLoading={()=><SekhmetActivityIndicator/>}
                inverted={false}
                onSend={messages => onSend(messages)}
                user={{
                    _id: account?.id,
                    ...account
                }}
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
    dateDividerContainer: {
        backgroundColor: '#ebebeb',
        borderRadius: 12,
        marginVertical: 8,
        alignSelf: 'center',
    },
    dateDividerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        padding: 8,
        color: 'gray',
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
