import React, {useEffect, useRef, useState} from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import { ListItem } from '@rneui/themed';
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import PhoneInput from "react-native-phone-number-input";
import {Channel} from "../shared/entity.model";
import {errorToast} from "../shared/toast";
import usePhoneNumberLogin from "../hooks/usePhoneNumberLogin";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height


export const getChannelComponent = (actions: (() => void)[]) => {
    const renderRow = ({item}: {item:{content:any; id:number}}) => {
        return (
            <ListItem>
                <ListItem.Content>
                    {item.content}
                </ListItem.Content>
            </ListItem>
        );
    };

    return <FlatList
        data={[
            {
                id: 0,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[0]();
                }}>
                    <MaterialIcons name="message" color="grey"
                                   style={{marginRight: 5, fontWeight: 'bold'}} size={20}/>
                    <Text style={{color: 'grey', fontWeight: 'bold'}}>SMS</Text>
                </TouchableOpacity>

            },
            {
                id: 1,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[1]();
                }}>
                    <MaterialIcons name="call" color="grey" style={{marginRight: 5, fontWeight: 'bold'}}
                                   size={20}/>
                    <Text style={{color: 'grey', fontWeight: 'bold'}}>Call me</Text>
                </TouchableOpacity>
            },
            {
                id: 2,
                content: <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                    actions[2]();
                }}>
                    <Ionicons name="logo-whatsapp" size={24} color="grey"
                              style={{marginRight: 5, fontWeight: 'bold'}}/>
                    <Text style={{color: 'grey', fontWeight: 'bold', marginTop: 4}}>WhatsApp</Text>
                </TouchableOpacity>

            }
        ]}
        renderItem={renderRow}
        keyExtractor={item => item.id+""}/>;
}

const InputPhoneNumberScreen = () => {
    const [phonenumber, setPhonenumber] = useState('');
    const [disabled, setDisabled] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    const { loginUser } = usePhoneNumberLogin(); // Here we get the loginUser function from your custom hook

    const sendCode = (channel: Channel) => {
        loginUser(phonenumber, channel)
            .then((response) => {
                router.push({ pathname: 'verify-phonenumber', params: { phonenumber } });
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                errorToast('Erreur', "Lors de la verification de votre numero");
            });
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: 'white'}}>
                    <View className="flex-1 items-center justify-center bg-white">
                        <Text style={styles.title}>Connectez vous avec votre Numero de Téléphone</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Un code va vous etre envoyer par un de moyen que vous aurez choisie (SMS, Appel ou Whatsapp){'\n'}
                            entrez ce code dans l'écran suivant pour vous connecter </Text>
                    </View>
                    <View style={{paddingVertical: 20, alignItems: 'center'}}>
                        <PhoneInput
                            ref={phoneInput}
                            defaultCode="CM"
                            placeholder="N° de téléphone"
                            textContainerStyle={{backgroundColor: 'transparent'}}
                            textInputStyle={{backgroundColor: 'transparent'}}
                            layout="first"
                            onChangeFormattedText={(phonenumber) => {
                                setPhonenumber(phonenumber);
                            }}
                            countryPickerProps={{withAlphaFilter: true}}
                            disabled={disabled}
                            withDarkTheme={false}
                            withShadow={false}
                            autoFocus={false}
                        />
                        <View style={{height: 2.0, width: width * 0.8, backgroundColor: 'grey'}}/>
                    </View>
                    {getChannelComponent([
                        () => {
                            sendCode(Channel.SMS)
                        },
                        () => {
                            sendCode(Channel.CALL)
                        },
                        () => {
                            sendCode(Channel.WHATSAPP)
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
})

export default InputPhoneNumberScreen;
