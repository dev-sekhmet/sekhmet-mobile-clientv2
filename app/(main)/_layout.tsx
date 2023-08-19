import {router, Stack} from 'expo-router';
import {Platform, useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import useFirstLaunch from "../../hooks/useFirstLaunch";
import React, {useEffect, useState} from "react";
import SekhmetActivityIndicator from "../../components/SekhmetActivityIndicator";
import useAccount from "../../hooks/useAccount";
import {Client, Conversation, Message, Paginator, Participant} from "@twilio/conversations";
import {IUser} from "../../shared/user.model";
import useToken from "../../hooks/useToken";
import {AppContext, TypingParticipant} from "../../components/AppContext";
import {getUserFullName} from "../../shared/user.utils";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isFirstLaunch = useFirstLaunch();
    const [twilioClient, setTwilioClient] = useState<Client | undefined>(undefined);
    const [accountInfos, setAccountInfos] = useState<IUser | undefined>(undefined);

    const {account, loading: authLoading, isAuthenticated} = useAccount();
    const {token, loading: tokenLoading} = useToken();
    const [loadingConversations, setLoadingConversations] = useState(true);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationsPaginator, setConversationsPaginator] = useState<Paginator<Conversation> | undefined>(undefined);
    const [typingStatus, setTypingStatus] = useState<Map<string, TypingParticipant>>(new Map());

    const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
    const [messagePaginator, setMessagePaginator] = useState<Map<string, Paginator<Message>>>(new Map());

    const fetchConversations = async (client: Client | null) => {
        setLoadingConversations(true);
        if (!client) return;
        try {
            const paginator = await client.getSubscribedConversations();
            setConversationsPaginator(paginator);
            setUniqueConversations(paginator.items);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoadingConversations(false);
        }
    }

    const fetchMessagesForConversation = async (conversation: Conversation) => {
        try {
            const messagePaginator = await conversation.getMessages();
            setMessagePaginator(prev => {
                const updatedPaginator = new Map(prev);
                updatedPaginator.set(conversation.sid, messagePaginator);
                return updatedPaginator;
            });
            setMessages(prev => {
                const updatedMessages = new Map(prev);
                updatedMessages.set(conversation.sid, messagePaginator.items);
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const fetchMoreConversations = async () => {
        console.log("fetchMoreConversations CALLED", Platform.OS)
        if (!conversationsPaginator?.hasNextPage) return;
        setLoadingConversations(true);
        try {
            const paginator = await conversationsPaginator.nextPage();
            setConversationsPaginator(paginator);  // Save the new paginator
            setUniqueConversations(paginator.items);
        } catch (error) {
            console.error('Error fetching more conversations:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMoreMessages = async (conversationSid: string) => {
        const currentPaginator = messagePaginator.get(conversationSid);
        if (currentPaginator && currentPaginator.hasNextPage) {
            try {
                const newPaginator = await currentPaginator.nextPage();
                setMessagePaginator(prev => {
                    const updatedPaginator = new Map(prev);
                    updatedPaginator.set(conversationSid, newPaginator);
                    return updatedPaginator;
                });
                setMessages(prev => {
                    const updatedMessages = new Map(prev);
                    const allMessages = [...newPaginator.items, ...(prev.get(conversationSid) || [])];
                    updatedMessages.set(conversationSid, allMessages);
                    return updatedMessages;
                });
            } catch (error) {
                console.error('Error fetching more messages:', error);
            }
        }
    }

    const setUniqueConversations = (newConversations: Conversation[]) => {
        setConversations(prevConversations => {
            // Create a set to keep track of added SIDs
            const existingSids = new Set(prevConversations.map(c => c.sid));

            // Filter out the conversations from newConversations which already exist
            const uniqueNewConversations = newConversations.filter(conversation => !existingSids.has(conversation.sid));

            // Return the combined list of conversations
            return [...prevConversations, ...uniqueNewConversations];
        });
    };
    const setIsTyping = (participant: Participant) => {
        const user: IUser = JSON.parse((participant.attributes) as string);
        const updatedStatus = new Map(typingStatus);
        const userFullName = getUserFullName(user);
        updatedStatus.set(participant.conversation.sid, {fullName: userFullName, typing: true});
        setTypingStatus(updatedStatus);
    };
    const unSetIsTyping = (participant: Participant) => {
        const updatedStatus = new Map(typingStatus);
        updatedStatus.set(participant.conversation.sid, {fullName: '', typing: false});
        setTypingStatus(updatedStatus);
    };
    const setMessage = (message: Message) => {
        setMessages(prevMessages => {
            const updatedMessages = new Map(prevMessages);
            let conversationMessages = updatedMessages.get(message.conversation.sid) || [];
            if (!conversationMessages.some(existingMessage => existingMessage.sid === message.sid)) {
                conversationMessages = [...conversationMessages, message];
            }
            updatedMessages.set(message.conversation.sid, conversationMessages);
            return updatedMessages;
        });
    };

    const unSetMessage = (message: Message) => {
        setMessages(prevMessages => {
            const updatedMessages = new Map(prevMessages);
            const conversationMessages = updatedMessages.get(message.conversation.sid)?.filter(m => m.sid !== message.sid);

            if (conversationMessages) {
                updatedMessages.set(message.conversation.sid, conversationMessages);
            }
            return updatedMessages;
        });
    };


    const doesConversationExists = (conversation: Conversation) => {
        return conversations.some(existingConversation => existingConversation.sid === conversation.sid);
    }

    const initTwilio = () => {
        if (isAuthenticated && token && !authLoading && !tokenLoading) {
            const client = new Client(token)
                .on('initialized', () => {
                    console.log('initialized OK');
                    setTwilioClient(client);
                    fetchConversations(client);
                })
                .on('initFailed', ({error}) => {
                    console.log('Error during init twilio', error);
                    //refreshingTwilioToken();
                })
                .on("conversationAdded", async (conversation: Conversation) => {
                    console.log('conversationAdded ', conversation.friendlyName);
                    conversation
                        .on("typingStarted", async (participant) => {
                            setIsTyping(participant);
                        })
                        .on("typingEnded", async (participant) => {
                            unSetIsTyping(participant);
                        })
                    // Add this line to update the conversations state:
                    // Check if the conversation with the same sid is not already present
                    setUniqueConversations([conversation]);

                    if (!doesConversationExists(conversation)) {
                        await fetchMessagesForConversation(conversation);
                    }
                })
                .on("conversationRemoved", (conversation: Conversation) => {
                    console.log('conversationRemoved', conversation.friendlyName);
                })
                .on("messageAdded", (message: Message) => {
                    console.log('messageAdded', message.index);
                    setMessage(message);
                })
                .on("messageUpdated", ({message}) => {
                    console.log('messageUpdated', message.index);
                })
                .on("messageRemoved", (message) => {
                    console.log('messageRemoved', message.index);
                    unSetMessage(message);
                })
                .on("participantLeft", (participant) => {

                    console.log("participantLeft", participant.attributes);
                })
                .on("participantUpdated", (event) => {
                    console.log("participantUpdated", event.participant.attributes);
                })
                .on("participantJoined", (participant) => {
                    console.log("participantJoined", participant.attributes);
                })
                .on("conversationUpdated", ({conversation, updateReasons}) => {
                    console.log('conversationUpdated, updateReasons', conversation.friendlyName, updateReasons.length);
                })
                .on("tokenExpired", () => {
                    console.log("Token expired");
                    //refreshingTwilioToken();
                });
        }
    }

    const isLoadind = authLoading || tokenLoading;

    useEffect(() => {
        if (isLoadind) {
            return;
        }
        if (account) {
            setAccountInfos(account || undefined);
        }

        if (account?.id && (!account?.firstName || !account?.lastName)) {
            router.replace("input-user-infos");
        } else if (isFirstLaunch) {
            router.replace("onboarding");
        } else if (!isAuthenticated) {
            console.log('isAuthenticated', isAuthenticated)
            router.replace("input-phonenumber");
        }

        initTwilio();

        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [authLoading, account, isFirstLaunch, isAuthenticated, tokenLoading, token]);

    if (isLoadind) {
        return <SekhmetActivityIndicator />;
    }

    return <AppContext.Provider value={{
        twilioClient,
        account: accountInfos,
        conversations,
        loadingConversations,
        fetchMoreConversations,
        typingStatus,
        messages,
        fetchMoreMessages,
        messagePaginator,
        conversationsPaginator
    }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="conversation" options={{
                headerShadowVisible: false,
                headerStyle: {backgroundColor: 'white'},
                title: ' '
            }}/>
        </Stack>
        </ThemeProvider>
    </AppContext.Provider>

}
