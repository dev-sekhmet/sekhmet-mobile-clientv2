import React from "react";
import {Image, Linking, StyleSheet, Text, View} from "react-native";
import {Button} from "react-native-paper";
import {useNavigation} from "@react-navigation/core";
import LAYOUT from '../constants/Layout';
import {router} from "expo-router";
import Colors from "../constants/Colors";
const TermsConditionsScreen = () => {
    const navigation = useNavigation();

    const checkAndGo = async () => {
        router.replace("input-phonenumber");
    }
    return (
            <View style={{
                height: LAYOUT.window.height,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <View style={{paddingTop: 20, maxWidth: LAYOUT.window.width}}>
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Image resizeMode="contain" borderRadius={5} width={400} height={400}
                               source={require('../assets/images/logo.png')}/>
                    </View>
                    <View style={{alignItems: 'center', maxWidth: '90%'}}>
                        <Text style={styles.title}>Welcome to Sekhmet</Text>
                    </View>
                </View>

                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: LAYOUT.window.width,
                    alignItems: 'center',
                    paddingVertical: 30,
                    paddingHorizontal: 20
                }}>
                    <Text style={styles.subtitle}>
                        Please read our <Text
                        onPress={() => Linking.openURL("https://dev-sekhmet.github.io/sekhmet-mobile-client/PrivatePolicy.html")}
                        style={styles.link}>privacy policy</Text>.
                        Press "accept and continue" to accept the <Text
                        onPress={() => Linking.openURL("https://dev-sekhmet.github.io/sekhmet-mobile-client/TermsConditions.html")}
                        style={styles.link}>terms of use</Text>
                    </Text>
                    <Button mode="contained" onPress={checkAndGo} contentStyle={{paddingHorizontal: 30}}
                            style={{borderRadius: 20, marginBottom: 10}} buttonColor={Colors.light.sekhmetGreen}>
                        ACCEPT AND CONTINUE
                    </Button>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: 'grey',
        fontSize: 13,
        marginTop: 10,
        marginBottom: 30,
        // maxWidth: '70%',
        textAlign: 'center',
        lineHeight: 20,
    },
    link: {
        color: Colors.light.sekhmetGreen
    }
})

export default TermsConditionsScreen;
