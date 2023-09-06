import {Client, Conversation, Message} from "@twilio/conversations";
import Moment from "moment";

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

export type DateFormatContext = 'chatItem' | 'conversation' | 'message';

export const getWhatsAppFormattedDate = (date: Date | number, context: DateFormatContext): string => {
    const today = Moment();
    const yesterday = Moment().subtract(1, 'day');

    if (context === 'message') {
        return Moment(date).format('HH:mm');
    }

    if (context === 'conversation') {
        if (Moment(date).isSame(today, 'day')) {
            return 'Aujourd’hui';  // French for "Today"
        } else if (Moment(date).isSame(yesterday, 'day')) {
            return 'Hier';  // French for "Yesterday"
        } else {
            return Moment(date).format('dddd, DD MMMM YYYY');
        }
    }

    if (Moment(date).isSame(today, 'day')) {
        return Moment(date).format('HH:mm');
    }

    if (Moment(date).isSame(yesterday, 'day')) {
        return "Hier";
    }

    const oneWeekAgo = today.clone().subtract(7, 'days');

    if (Moment(date).isAfter(oneWeekAgo)) {
        return Moment(date).format('dddd');
    }

    if (Moment(date).year() === today.year()) {
        return Moment(date).format('DD MMMM');
    }

    return Moment(date).format('DD MMMM YYYY');
};
