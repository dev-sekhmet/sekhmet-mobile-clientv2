import React from "react";
import {Platform, View} from "react-native";
import {router} from "expo-router";
import UserInfos from "../components/UserInfos";
const topSpacing = Platform.OS === 'android' ? 50 : 0;
const InputUserInfos = () => {

    return (
        <View className="flex-1 items-center justify-center">
            <UserInfos actionAfterSave={() => router.replace('/')}/>
        </View>
    )
}
export default InputUserInfos;
