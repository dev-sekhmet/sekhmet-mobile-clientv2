// hooks/useConversation.ts
import { useState, useEffect, useContext } from 'react';
import {AppContext} from "../components/AppContext";
import {Conversation} from "@twilio/conversations";

function useConversation(uniqueName: string) {
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { twilioClient } = useContext(AppContext);

    useEffect(() => {
        async function fetchConversation() {
            setIsLoading(true);
            try {
                let fetchedConversation = await twilioClient?.getConversationByUniqueName(uniqueName);
                setConversation(fetchedConversation || null);
            } catch (err: any) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchConversation();
    }, [uniqueName, twilioClient]);

    return { conversation, isLoading, error };
}

export default useConversation;
