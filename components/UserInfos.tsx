import React, {useEffect} from "react";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {Button} from "react-native-paper";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import {IUser} from "../shared/user.model";
import {updateUser} from "../tech/account.api";
import {errorToast} from "../shared/toast";
import SekhmetAvatar from "../components/SekhmetAvatar";
import useAccount from "../hooks/useAccount";
import SekhmetActivityIndicator from "./SekhmetActivityIndicator";

const errorRequiredField = 'Ce champ est requis';
const UserInfos = ({actionAfterSave}: { actionAfterSave: Function }) => {
    const {account, loading, error} = useAccount();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (account) {
            setValue('firstName', account?.firstName);
            setValue('lastName', account?.lastName);
            setValue('email', account?.email);
        }

    }, [account, loading]);

    const {control, setValue, handleSubmit, formState: {errors}} = useForm<IUser>({
        defaultValues: {
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
        }
    });


    const handleValidSubmit = (values: IUser) => {
        updateUser(values)
            .then(() => {
                actionAfterSave();
            })
            .catch((error) => {
                errorToast('Erreur', "Lors de l'enregistrement de vos informations");
            });
    };

    if (loading) {
        return <SekhmetActivityIndicator/>;
    }

    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}>
                <View style={{paddingVertical: 10, alignItems: 'center'}}>
                    <SekhmetAvatar
                        size={80}
                        icon={{
                            name: 'camera-alt',
                            type: 'material',
                            color: 'grey',
                        }}
                        containerStyle={{
                            borderColor: 'grey',
                            borderStyle: 'solid',
                            borderWidth: 1,
                        }}
                    />
                    <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 4, fontSize: 15}}>Photo de
                        profil</Text>
                    <View
                        style={{height: 1.0, marginTop: 1, width: Layout.window.width * 0.8, backgroundColor: 'grey'}}/>
                </View>

                {/*For first name*/}
                <View style={styles.inputBlock}>
                    <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                        nom*</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={styles.inputField}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="firstName"
                    />
                    {errors.firstName && <Text style={{color: 'red'}}>{errorRequiredField}</Text>}
                </View>

                {/*    For lastname*/}
                <View style={styles.inputBlock}>
                    <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                        prenom</Text>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={styles.inputField}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="lastName"
                    />
                    {errors.lastName && <Text style={{color: 'red'}}>{errorRequiredField}</Text>}
                </View>

                {/*    For email*/}
                <View style={styles.inputBlock}>
                    <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Adresse
                        email</Text>
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                            required: true,
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={styles.inputField}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="email"
                    />
                    {errors.email && <Text style={{color: 'red'}}>{errorRequiredField}</Text>}
                </View>

                <Button mode="contained" onPress={handleSubmit(handleValidSubmit)}
                        contentStyle={{paddingHorizontal: 50}}
                        style={{borderRadius: 20, marginBottom: 10, marginTop: 30}} buttonColor={Colors.light.sekhmetGreen}>
                    Enregistrer
                </Button>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        padding: 20,
    },
    inputField: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        borderRadius: 3,
    },
    inputBlock: {marginBottom: 10, marginTop: 5}
});

export default UserInfos;
