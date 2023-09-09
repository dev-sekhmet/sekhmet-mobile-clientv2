import {Alert, FlatList, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {Text, View} from '../../components/Themed';
import {Link, useLocalSearchParams, useNavigation} from "expo-router";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../components/AppContext";
import useConversation from "../../hooks/useConversation";
import SekhmetActivityIndicator from "../../components/SekhmetActivityIndicator";
import {displayConversationName, getWhatsAppFormattedDate} from "../../shared/conversation.utils";
import {Message as TwilioMessage, User} from "@twilio/conversations";
import useAccount from "../../hooks/useAccount";
import 'moment/locale/fr'
import {Message} from "../../constants/Type";
import Moment from "moment/moment";
import {GiftedChat, IMessage, InputToolbar, LoadEarlier} from "react-native-gifted-chat";
import 'dayjs/locale/fr'
import {useActionSheet} from "@expo/react-native-action-sheet";
import MessageInput from "../../components/MessageInput";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";


const HeaderTitle = ({title, typing}: { title: string, typing: boolean }) => {
    return (
        <View>
            <Text style={styles.titleText}>{title}</Text>
            {typing && <Text>écrit ...</Text>}
        </View>
    );
}
const Day = ({createdAt}: { createdAt: Date | undefined | number }) => {
    return (
        <View style={styles.dateDividerContainer}>
            <Text style={styles.dateDividerText}>
                {getWhatsAppFormattedDate(createdAt || 0, 'conversation')}
            </Text>
        </View>
    );
}

const ScrollToBottomComponent = ({ unreadCount, onPress }: { unreadCount : number, onPress : ()=>void}) => {
    return (
        <Pressable
            onPress={onPress}
            style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.light.sekhmetGreen,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Ionicons name="arrow-down" size={24} color="white" />
            {unreadCount > 0 && (
                <View style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{unreadCount}</Text>
                </View>
            )}
        </Pressable>
    );
};
const ConversationSrreen = () => {
    const {uniqueName} = useLocalSearchParams<any>();
    const {
        twilioClient,
        typingStatus,
        messages,
        fetchMoreMessages,
        messagePaginator,
    } = useContext(AppContext);
    const {showActionSheetWithOptions} = useActionSheet();
    const { conversation, isLoading, error } = useConversation(uniqueName);
    const conversationMessages = messages?.get(conversation?.sid || '') || [];
    const conversationMessagePaginator = messagePaginator?.get(conversation?.sid || '');
    const {account} = useAccount();
    const [user, setUser] = useState<User | undefined>(twilioClient?.user);
    const [messageReplyTo, setMessageReplyTo] = useState<IMessage | null>(
        null
    );
    const [giftedChatMessages, setGiftedChatMessages] = useState<IMessage[]>([]);

    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const {typing, fullName} = typingStatus?.get(conversation?.sid || '') || {typing: false, fullName: ''};

    const navigation = useNavigation();
    const giftedChatRef = useRef<any>();


    const getMedia = async (message: TwilioMessage) => {
        return message.attachedMedia && message.attachedMedia.length>0? await message.attachedMedia[0].getContentTemporaryUrl():'';
    }
    const mapToGiftedChatMessages = async (items: TwilioMessage[]) => {
        const messagesWithAuthors = await Promise.all(items.map(async twilioMessage => {
            const user = await twilioClient?.getUser(twilioMessage.author || '');
            const image =  (await getMedia(twilioMessage)) ?? undefined;
            return {
                _id: twilioMessage.sid,
                text: twilioMessage.body || '',
                createdAt: twilioMessage.dateCreated || 1,
                user: {
                    _id: user?.identity || '',
                    name: user?.friendlyName  || '',
                    avatar: 'https://placeimg.com/140/140/any',
                },
                image,
                deleted: false,
            }
        }));

        setGiftedChatMessages(messagesWithAuthors);
    };

    const loadEarlier = async () => {
        setIsLoadingEarlier(true);
        if (fetchMoreMessages) {
            await fetchMoreMessages(conversation?.sid || '');
        }
        setIsLoadingEarlier(false);
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
            mapToGiftedChatMessages(conversationMessages);
        }

    }, [conversationMessages]);

    useEffect(() => {
        if (giftedChatMessages.length > 0) {
            setTimeout(() => {
                giftedChatRef.current.scrollToEnd({ animated: true });
            }, 1000);
        }

    }, [giftedChatMessages]);

    const needsDateDivider = (messageCurr: IMessage | undefined, messagePrev: IMessage | undefined): boolean => {
        if (!messageCurr) return true;
        const currentDate = Moment(messageCurr?.createdAt || undefined);
        const previousDate = Moment(messagePrev?.createdAt || undefined);
        return !currentDate.isSame(previousDate, 'day');
    }

    if (isLoading) {
        return <SekhmetActivityIndicator />;
    }


    const deleteMessage = async () => {
        //message.twilioMessage.remove();
    };

    const confirmDelete = (message: IMessage) => {
            Alert.alert(
                "Confirmer la Suppression",
                "Voulez-vous vraiment supprimer ce message ?",
                [
                    {
                        text: "Supprimer",
                        onPress: deleteMessage,
                        style: "destructive",
                    },
                    {
                        text: "Cancel",
                    },
                ]
            );

    };

    const onActionPress = (message: IMessage, index?: number) => {
        if (index === 0) {
            setMessageReplyTo(message);
        } else if (index === 1) {
            if (message.user._id === account?.id) {
                confirmDelete(message);
            } else {
                Alert.alert("Action impossible", "Ceci n'est pas votre message");
            }
        }
    };

    const scrollToBottom = () => {
        giftedChatRef.current.scrollToEnd({ animated: true });
    };

    const openActionMenu = (message: IMessage) => {
        const options = ["Repondre", "Supprimer", "Annuler"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            index => onActionPress(message, index)
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <GiftedChat
                scrollToBottom={true}
                scrollToBottomComponent={() => <ScrollToBottomComponent unreadCount={0} onPress={scrollToBottom}/>}
                listViewProps={{
                    ref: giftedChatRef
                }}
                messages={giftedChatMessages}
                placeholder="Votre message..."
                onLoadEarlier={()=>loadEarlier()}
                loadEarlier={true}
                isLoadingEarlier={isLoadingEarlier}
                renderLoadEarlier={(props)=>{
                    if (conversationMessagePaginator?.hasPrevPage) {
                        return <LoadEarlier {...props} label='voir les précédents messages'/>
                    }
                }}
                locale='fr'
                renderLoading={()=><SekhmetActivityIndicator/>}
                inverted={false}
                renderDay={(props) => {
                    if (needsDateDivider(props.currentMessage, props.previousMessage)) {
                        return <Day createdAt={props.currentMessage?.createdAt}/>
                    }
                }}
                onLongPress={(context, message)=>{
                    openActionMenu(message);
                }}
                renderInputToolbar={(props) =>
                    /*<InputToolbar {...props}/>*/
                    <MessageInput
                        conversation={conversation}
                        messageReplyTo={null}
                        removeMessageReplyTo={() => setMessageReplyTo(null)}
                    />}
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
