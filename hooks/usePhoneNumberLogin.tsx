import { useEffect } from 'react';
import useToken from './useToken';
import {Channel} from "../shared/entity.model";
import api from "../tech/api";

const usePhoneNumberLogin = () => {
    const { token, saveToken } = useToken();

    const loginUser = async (phoneNumber: string, channel: Channel) => {
        const phoneNumberEncoded = encodeURIComponent(phoneNumber);
        const response = await api.get(`/authenticate?phoneNumber=${phoneNumberEncoded}&channel=${channel}`);

        return response.data;
    };

    const verifyPhoneNumber = async (phoneNumber: string, otp: string) => {
        const phoneNumberEncoded = encodeURIComponent(phoneNumber);
        const response = await api.get(`/verify?phoneNumber=${phoneNumberEncoded}&token=${otp}`);

        const jwt = response.data.id_token;

        // Store the token using the custom hook
        await saveToken(jwt);

        return jwt;
    };

    return {
        token,
        loginUser,
        verifyPhoneNumber,
    };
};

export default usePhoneNumberLogin;
