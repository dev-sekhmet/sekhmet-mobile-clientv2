import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AUTH_TOKEN} from "../constants/Keys";

const useToken = () => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string|null>(null);

    const loadData = async () => {
        try {
            const value = await AsyncStorage.getItem(AUTH_TOKEN);
            if (value !== null) {
                setToken(value);
            }
        } catch (error) {
            console.error("An error occurred while loading the token.", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveToken = async (value: string) => {
        try {
            await AsyncStorage.setItem(AUTH_TOKEN, value);
            setToken(value);
        } catch (error) {
            console.error("An error occurred while saving the token.", error);
        }
    };

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem(AUTH_TOKEN);
            setToken(null);
        } catch (error) {
            console.error("An error occurred while removing the token.", error);
        }
    };

    return {
        loading,
        token,
        saveToken,
        removeToken
    };
};

export default useToken;
