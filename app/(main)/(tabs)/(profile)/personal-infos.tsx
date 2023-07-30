import {StyleSheet} from 'react-native';
import {View} from '../../../../components/Themed';
import React from "react";
import {router} from "expo-router";
import UserInfos from "../../../../components/UserInfos";

export default function PersonalInfosScreen() {

    return (
        <View className="flex-1 items-center justify-center">
            <UserInfos actionAfterSave={() => router.back()}/>
        </View>
    );
}
