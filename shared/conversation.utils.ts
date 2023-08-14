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
};export const getLastMessageTime = (lastMessage?: Message) => {
    if (!lastMessage || !lastMessage.dateCreated) {
        return "";
    }

    const lastMessageDate = new Date(lastMessage.dateCreated);
    const today = new Date();

    const diffInMilliseconds = today.getTime() - lastMessageDate.getTime();

    const secondLength = 1000;
    const minuteLength = 60 * secondLength;
    const hourLength = 60 * minuteLength;
    const dayLength = 24 * hourLength;

    const diffInMinutes = Math.floor(diffInMilliseconds / minuteLength);
    const diffInHours = Math.floor(diffInMilliseconds / hourLength);
    const diffInDays = Math.floor(diffInMilliseconds / dayLength);

    if (diffInMilliseconds < 60 * secondLength) {
        return "maintenant";
    }

    if (diffInMinutes < 60) {
        return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }

    if (diffInHours < 24) {
        return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }

    if (diffInDays === 1) {
        return `Hier ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(lastMessageDate)}`;
    }

    if (diffInDays < 7) {
        return `il y a ${diffInDays} jours`;
    }

    const diffInWeeks = Math.floor(diffInMilliseconds / (dayLength * 7));

    if (diffInWeeks === 1) {
        return "il y a 1 semaine";
    }

    if (diffInWeeks < 52) {
        return `il y a ${diffInWeeks} semaines`;
    }

    const diffInYears = Math.floor(diffInMilliseconds / (dayLength * 365.25));  // 365.25 to consider leap years

    if (diffInYears === 1) {
        return "il y a 1 an";
    }

    return `il y a ${diffInYears} ans`;
}

