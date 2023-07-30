import {StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import {Avatar} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN} from "../constants/Keys";

const SekhmetAvatar = (props: any) => {
    const [token, setToken] = useState<string|null>('');
    useEffect(() => {
        const initToken = async () => {
            const token = await AsyncStorage.getItem(AUTH_TOKEN);
            setToken(token);
        }
        if (token === '') {
            initToken();
        }

    }, [token]);
    return <Avatar rounded
        size={props.size}
        source={{uri: 'https://randomuser.me/api/portraits/women/57.jpg'}}
        containerStyle={styles.profilAvatar}
    >
        {props.badge && <Avatar.Accessory containerStyle={props.badge.styles} size={23}/>}
    </Avatar>
}

const styles = StyleSheet.create({
    profilAvatar: {
        borderColor: 'grey',
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: 'grey',
    }
});
export default SekhmetAvatar;
