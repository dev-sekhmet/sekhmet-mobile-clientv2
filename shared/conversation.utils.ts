import {Client, Conversation, Message, Participant} from "@twilio/conversations";
import {IUser} from "./user.model";
import {getUserFullName} from "./user.utils";
import {TypingParticipant} from "../components/AppContext";

export const doesConversationExist = async (twilioClient: Client | undefined, uniqueName: string) => {
    try {
        const conversation = await twilioClient?.getConversationByUniqueName(uniqueName);

        // If the conversation object exists and has a sid, it exists.
        if (conversation && conversation.sid) {
            return true;
        }
    } catch (error) {
        console.error('Error fetching the conversation:', error);
    }

    return false;
};


export const getSortedUniqueName = (id1: string, id2: string) => {
    const ids = [id1, id2].sort();
    return `dual-${ids[0]}-${ids[1]}`;
};

export const displayConversationName = (accountId:string, conversation: Conversation | null) => {
    const attributes = conversation?.attributes as any;
    if (typeof attributes === 'object' && attributes !== null && 'userA' in attributes && 'userB' in attributes) {
        // Check if the current user is userA or userB
        if (attributes.userA.id === accountId) {
            return attributes.userB.name;
        } else if (attributes.userB.id === accountId) {
            return attributes.userA.name;
        }
    }
    return null;
};



export const getLastMessageTime = (lastMessage: Message | undefined) => {
    if (lastMessage === undefined || lastMessage === null) {
        return "";
    }
    const lastMessageDate: Date| null = lastMessage.dateCreated;
    const today = new Date();
    const diffInDates = lastMessageDate ? Math.floor(today.getTime() - lastMessageDate.getTime()) : 0;


    const dayLength = 1000 * 60 * 60 * 24;
    const weekLength = dayLength * 7;
    const yearLength = weekLength * 52;
    const diffInDays = Math.floor(diffInDates / dayLength);
    const diffInWeeks = Math.floor(diffInDates / weekLength);
    const diffInYears = Math.floor(diffInDates / yearLength);
    if (diffInDays < 0) {
        return "";
    }
    if (diffInDays === 0 && lastMessageDate) {
        const minutesLessThanTen = lastMessageDate.getMinutes() < 10 ? "0" : "";
        return (
            lastMessageDate.getHours().toString() +
            ":" +
            minutesLessThanTen +
            lastMessageDate.getMinutes().toString()
        );
    }
    if (diffInDays === 1) {
        return "il y a 1 jour";
    }
    if (diffInDays < 7) {
        return `il y a ${diffInDays} jours`;
    }
    if (diffInDays < 14) {
        return "Il ya 1 semaine";
    }
    if (diffInWeeks < 52) {
        return `Il y a ${diffInWeeks} semaines`;
    }
    if (diffInYears < 2) {
        return "il y a 1 an";
    }
    return `Il ya ${diffInYears} ans`;
}
