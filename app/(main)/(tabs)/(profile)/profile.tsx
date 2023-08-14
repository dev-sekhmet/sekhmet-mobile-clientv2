import {ColorValue, Dimensions, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import PhoneInput from "react-native-phone-number-input";
import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import * as ImagePicker from "expo-image-picker";
import useAccount from "../../../../hooks/useAccount";
import {useActionSheet} from "@expo/react-native-action-sheet";
import SekhmetActivityIndicator from "../../../../components/SekhmetActivityIndicator";
import {IUser} from "../../../../shared/user.model";
import Colors from "../../../../constants/Colors";
import {Avatar, Icon, ListItem} from "@rneui/themed";
import {Switch} from "@rneui/base";
import {successToast} from "../../../../shared/toast";
import {View, Text} from "../../../../components/Themed";
import usePhoneNumberLogin from "../../../../hooks/usePhoneNumberLogin";
import useToken from "../../../../hooks/useToken";
import {router} from "expo-router";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
type MenuItem = {
    title: string;
    icon: string;
    color?: ColorValue | number | undefined;
    notif?: boolean
    type?: 'account' | 'notif' | 'plus',
    action?: Function
};

export default function Profil() {

    const {showActionSheetWithOptions} = useActionSheet();
    const phoneInput = useRef<PhoneInput>(null);
    const { removeToken } = useToken();
    const {account, loading, error} = useAccount();

    useEffect(() => {
        if (loading) {
            return;
        }

    }, [account, loading]);



    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
            phoneNumber: account?.phoneNumber
        }
    });

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['100%', '80%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const languageOptions = ["Francais", "Anglais", "Annuler"];
    const [user, setUser] = useState<IUser>({firstName: "", lastName: "", email: ""});
    const [accountItems, setAccountItems] = useState<MenuItem[]>([
        {
            title: 'Mon compte',
            icon: 'person',
            color: Colors.light.sekhmetGreen,
            action() {
                router.push("personal-infos");
            }
        },
        {
            title: 'Mon Adresse',
            icon: 'location-on',
            color: Colors.light.sekhmetGreen
        }
    ]);

    const [notificationItems, setNotificationItems] = useState<MenuItem[]>([
        {
            title: 'Push Notification',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: false,
            type: "notif"
        },
        {
            title: 'Notification Promo',
            icon: 'notifications',
            color: Colors.light.sekhmetGreen,
            notif: true,
            type: "notif"
        }
    ]);

    const logout = async () => {
        try {
            await removeToken(); // remove the token from AsyncStorage
            router.replace("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    const [plusItems, setPlusItems] = useState<MenuItem[]>([
        {
            title: 'Langue',
            icon: 'language',
            color: Colors.light.sekhmetGreen,
            action() {
                openLanguageActionMenu();
            }
        },
        {
            title: 'A propos de sekhmet',
            icon: 'info',
            color: Colors.light.sekhmetGreen
        },
        {
            title: 'Deconnexion',
            icon: 'logout',
            color: Colors.light.sekhmetOrange,
            action() {
                logout();
            }
        }
    ]);
    const action = (item: MenuItem) => {
        if (item.action) {
            item.action();
        }
    };

    const onSave = (values: IUser) => {
        console.log("values", values);
    }

    const setChecked = (id: string) => {
        const newList = notificationItems.map((item) => {
            if (item.title === id) {
                const updatedItem: MenuItem = {
                    ...item,
                    notif: !item.notif,
                };
                return updatedItem;
            }
            return item;
        });

        setNotificationItems(newList);
    }

    const renderRow = ({item}: { item: MenuItem }) => {
        return (
            <ListItem
                bottomDivider
                onPress={() => action(item)} hasTVPreferredFocus={undefined} tvParallaxProperties={undefined}>
                <Icon color={item.color} name={item.icon}/>
                <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                {!item.type && <ListItem.Chevron/>}
                {item.type && <Switch value={item.notif} onValueChange={(value) => setChecked(item.title)}/>}
            </ListItem>
        );
    };

    const openLanguageActionMenu = () => {
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options: languageOptions,
                cancelButtonIndex
            },
            onLanguageActionPress
        );
    };

    const onLanguageActionPress = (index: number | undefined) => {
        if (index && index !== 2) {
            successToast('Langue enregistré', `votre choix de langue ${languageOptions[index]} a été pris en compte`);
        }
    };

    const menuData = [
        {nameMenu: "Mon Compte", data: accountItems},
        {nameMenu: "Notifications", data: notificationItems},
        {nameMenu: "Plus", data: plusItems}
    ];
    const getAccountModal = () => {
        return <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 11,
                },
                shadowOpacity: 0.57,
                shadowRadius: 15.19,

                elevation: 23
            }}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <SafeAreaView>
                <ScrollView
                    style={{padding: 20, backgroundColor: 'white', borderRadius: 10, borderColor: 'black'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View
                        style={
                            {
                                paddingVertical: 10
                            }
                        }>
                        <View
                            style={styles.row}>
                            <Avatar
                                size={60}
                                rounded
                                source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                            />
                            <Pressable onPress={handleSubmit(onSave)}>
                                <Text style={{color: Colors.light.sekhmetGreen}} >Enregistrer</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/*For first name*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Nom</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <BottomSheetTextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Nom"
                                    underlineColorAndroid="transparent"
                                />
                            )}
                            name="firstName"
                        />
                        {errors.firstName && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>

                    {/*    For lastname*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Votre
                            Prénom</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <BottomSheetTextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="lastName"
                        />
                        {errors.lastName && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>

                    {/*    For email*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>
                            Email</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <BottomSheetTextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Adresse Email"
                                    underlineColorAndroid="transparent"
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>

                    {/*    For Telephone*/
                    }
                    <View style={{marginBottom: 10, marginTop: 5}}>
                        <Text style={{textAlign: 'left', color: 'grey', fontWeight: 'normal', marginVertical: 3}}>Numéro
                            de telephone</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <BottomSheetTextInput
                                    style={{
                                        height: 40,
                                        borderColor: 'grey',
                                        borderWidth: 0.5,
                                        borderRadius: 3,
                                        paddingHorizontal: 8
                                    }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="phoneNumber"
                        />
                        {errors.phoneNumber && <Text style={{color: 'red'}}>This is required.</Text>}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </BottomSheetModal>
    }
    // Image picker
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            // @ts-ignore
            const split = result.assets[0].uri.split('/')
            const fileName = split[split.length - 1]
            const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
            const profilPic = {
                type: 'image/' + fileExtension,
                name: fileName,
                //uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', ''),
                // @ts-ignore
                uri: result.assets[0].uri
            };

            let formData = new FormData();
            // @ts-ignore
            formData.append("file", profilPic);
            console.log('file', profilPic)
            //dispatch(saveProfilPicture(formData));
        }
    };
    const borderTopRadius = 33;
    return (
        <View style={{backgroundColor: '#eaeaea', flex: 1, height}}>

            <SafeAreaView style={{flex: 1}}>
                <View style={{paddingVertical: 10, alignItems: 'center', backgroundColor: '#eaeaea'}}>

                    <Avatar
                        size={height < 670 ? 45 : 80}
                        rounded
                        source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                    />

                    <Text style={{
                        textAlign: 'center',
                        marginTop: 5,
                        marginBottom: 4,
                        fontSize: 18
                    }}></Text>
                    <Text style={{textAlign: 'center', marginBottom: 4, fontSize: 12}}>+237 691 380 458</Text>
                </View>
                <View style={{backgroundColor: 'white', flex: 1, borderTopLeftRadius: borderTopRadius,
                    borderTopRightRadius: borderTopRadius
                }}>
                    <FlatList
                        data={menuData}
                        style={{borderTopLeftRadius: borderTopRadius, borderTopRightRadius: borderTopRadius}}
                        renderItem={({item}) => {
                            return <View style={{backgroundColor: 'transparent'}}>
                                <Text style={styles.titleMenu}>{item.nameMenu}</Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={item.data}
                                    renderItem={renderRow}
                                    keyExtractor={i => i.title}/>
                            </View>
                        }}
                        keyExtractor={item => item.nameMenu}/>

                </View>

                {getAccountModal()}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleMenu: {
        fontSize: 20,
        margin: 20,
        fontWeight: 'bold'
    },     row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        width: '100%'
    },
    pencilContainer: {
        backgroundColor: Colors.light.sekhmetOrange,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: 'white',
        position: 'absolute',
        left: 18,
        top: -23,
    }
});
