import {Client, Conversation, Message} from "@twilio/conversations";

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

export const getWhatsAppFormattedDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return "Hier";
    }

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    if (date > oneWeekAgo) {
        return new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
    }

    if (date.getFullYear() === today.getFullYear()) {
        return new Intl.DateTimeFormat('fr-FR', { month: 'long', day: '2-digit' }).format(date);
    }

    return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long', day: '2-digit' }).format(date);
};

