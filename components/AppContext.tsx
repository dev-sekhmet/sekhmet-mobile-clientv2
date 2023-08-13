import React from 'react';
import {Client, Conversation, Message, Paginator, Participant} from "@twilio/conversations";
import {IUser} from "../shared/user.model";

export interface TypingParticipant {
    fullName: string,
    typing: boolean
}
interface AppContextInterface {
    twilioClient?: Client;
    account?: IUser;
    conversations?: Conversation[];
    fetchMoreConversations?: () => {};
    loadingConversations?: boolean;
    typingStatus?: Map<string, TypingParticipant>;
    messages?: Map<string, Message[]>;
    fetchMoreMessages?: (conversationSid: string)=>{};
    messagePaginator?: Map<string, Paginator<Message>>;
    conversationsPaginator?: Paginator<Conversation>;
}
// Initialize the Context with an undefined value
export  const  AppContext = React.createContext<AppContextInterface >({});
