import React, {useRef, useState} from "react";
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";
import {router, useLocalSearchParams} from "expo-router";
import OTPTextInput from "react-native-otp-textinput";
import {getChannelComponent} from "./input-phonenumber";
import {errorToast} from "../shared/toast";
import usePhoneNumberLogin from "../hooks/usePhoneNumberLogin";


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const OTP_COUNT = 6;
const VerifyCodeScreen = () => {
    const [sendCode, setSendCode] = useState(false);
    const {phonenumber} = useLocalSearchParams();
    const otpInput = useRef<OTPTextInput>(null);
    const {verifyPhoneNumber} = usePhoneNumberLogin(); // Here we get the verifyPhoneNumber function from your custom hook

    const checkVerificationCode = (token: string) => {
        if (token && token.length === OTP_COUNT) {
            verifyPhoneNumber(phonenumber as string, token)
                .then((res) => {
                    router.replace('/');
                })
                .catch((err) => {
                    errorToast('Erreur', "Lors de la verification de votre numéro");
                });
        }
    }


    return (
            <View  className="flex-1 items-center justify-center bg-white">
                <SafeAreaView  className="flex-1 items-center justify-center bg-white">
                    <View>
                        <View style={{paddingVertical: 10, alignItems: 'center'}}>
                            <Text style={styles.title}>Enter your verification code</Text>
                        </View>
                        <View style={{paddingBottom: 10, alignItems: 'center'}}>
                            <Text style={styles.subtitle}>
                                {phonenumber} <Text onPress={() => router.back()} style={styles.link}>Wrong
                                number ?</Text>
                            </Text>
                        </View>
                        <View style={{paddingVertical: 20, alignItems: 'center'}}>

                            <OTPTextInput
                                tintColor={Colors.light.sekhmetGreen}
                                handleTextChange={checkVerificationCode}
                                ref={otpInput}
                                inputCount={OTP_COUNT}
                            />

                        </View>
                        <View><Text className="text-center">Renvoyer le code par </Text></View>
                        {getChannelComponent(
                            [
                                () => {

                                },
                                () => {

                                },
                                () => {

                                }]
                        )}
                    </View>
                </SafeAreaView>
            </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 22,
        // maxWidth: '70%',
        fontWeight: 'bold',
        // marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: 'grey',
        fontSize: 13,
        marginTop: 0,
        marginBottom: 20,
        maxWidth: '95%',
        textAlign: 'center',
        lineHeight: 20,
    },
    link: {
        color: Colors.light.sekhmetGreen
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 0,
        color: "black",
        fontSize: 20,
    },
    underlineStyleHighLighted: {
        color: "green",
        fontSize: 20,
    }
})

export default VerifyCodeScreen;
