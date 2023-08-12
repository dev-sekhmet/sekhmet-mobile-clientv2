import {Client, Conversation, Participant} from "@twilio/conversations";
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
