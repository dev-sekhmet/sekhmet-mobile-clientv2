import React, {useContext, useEffect, useState} from "react";
import {FlatList, StyleSheet, TextInput} from "react-native";
import {router, Stack, useLocalSearchParams, useNavigation} from "expo-router";
import useUsers from "../../../../hooks/useUsers";
import SekhmetActivityIndicator from "../../../../components/SekhmetActivityIndicator";
import {View} from "../../../../components/Themed";
import {errorToast} from "../../../../shared/toast";
import {IUser} from "../../../../shared/user.model";
import {CONVERSATION_TYPE} from "../../../../constants/Type";
import UserItem from "../../../../components/UserItem";
import {FAB} from "@rneui/base";
import Colors from "../../../../constants/Colors";
import useAccount from "../../../../hooks/useAccount";
import AlertPrompt from "../../../../components/AlertPrompt";
import {AppContext} from "../../../../components/AppContext";
import {getUserFullName} from "../../../../shared/user.utils";
import {
    displayConversationName,
    doesConversationExist,
    getSortedUniqueName
} from "../../../../shared/conversation.utils";


export default function CreateConversation() {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const {account, isAdmin, isCoach} = useAccount();

    const {screenTitle, conversationType} = useLocalSearchParams<any>();
    const {users, loading, error} = useUsers(searchValue);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const {twilioClient} = useContext(AppContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (loading) {
            return;
        }else {
            setIsSearching(false);
        }

        navigation.setOptions({
            headerTitle:screenTitle,
        });
    }, [loading, users]);



    const onChangeSearch = (searchQuery: string) => {
        setIsSearching(true);
        setSearchValue(searchQuery);
    }

    const createDualConversation = async (uniqueName: string, user: IUser) => {
        try {
            const conversation = await twilioClient?.createConversation({
                uniqueName: uniqueName,
                friendlyName: getUserFullName(user),
                attributes: {
                    type: CONVERSATION_TYPE.DUAL,
                    userA: {
                        id: account?.id,
                        name: getUserFullName(account ?? {}),
                    },
                    userB: {
                        id: user.id,
                        name: getUserFullName(user),
                    },
                },
            });

            await conversation?.add(account?.id, JSON.stringify(account));
            await conversation?.add(user.id, JSON.stringify(user));
            console.log('created conversation', conversation?.friendlyName);
        } catch (error) {
            console.error('Error creating a dual conversation:', error);
        }
    }

    const selectedUser = async (user: IUser, isSelected: boolean) => {
        if (conversationType === CONVERSATION_TYPE.DUAL) {
            const uniqueName = getSortedUniqueName(account?.id, user.id);
            const exists = await doesConversationExist(twilioClient, uniqueName);
            if (!exists) {
                await createDualConversation(uniqueName, user);
            }
            router.back();
            router.push({
                pathname: "conversation",
                params: {
                    uniqueName
                }
            });
        } else {
            setSelectedUsers(isSelected ?
                [...selectedUsers, user] : selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        }

    }

    const isValidUserNumber = () => {
        return selectedUsers.length >= 2;
    }


    const createGroup = (groupName: string | undefined) => {
        if (!groupName) {
            enterGroupName();
            return;
        }
        if (isValidUserNumber()) {
       /*     setLoading(true);
            dispatch(findOrCreateConversation({
                ids: selectedUsers.map(user => user.id),
                friendlyName: groupName,
                description: "",
            }));*/
        }
    }
    const enterGroupName = () => {
        setIsPromptVisible(true);
    };

    const handleCancel = () => {
        setIsPromptVisible(false);
    };

    const handleSubmit = (groupName: string) => {
        setIsPromptVisible(false);
        createGroup(groupName);
    };


    let usersWithoutMe : IUser[] = [];
    if (users) {
        usersWithoutMe = users.filter(user => user.id !== account?.id);
    }
    const canCreateGroup = (isAdmin || isCoach) && conversationType === CONVERSATION_TYPE.GROUP;

    if (loading && !isSearching) {
        return <SekhmetActivityIndicator/>
    }
    if (error) {
        errorToast('Erreur', 'lors de la recuperation des users');
        return <SekhmetActivityIndicator/>
    }

    return <View>
        <View style={[styles.view, {marginTop: 15}]}>

            <TextInput
                style={styles.inputText}
                placeholder={'Taper le nom ou le numéro'}
                onChangeText={onChangeSearch}
                value={searchValue}
            />

            <FlatList
                data={usersWithoutMe}
                renderItem={({item}) => (
                    <UserItem
                        user={item}
                        execSelection={selectedUser}
                        isUserSelected={selectedUsers.some(selectedUser => selectedUser.id === item.id)}
                    />
                )}
                keyExtractor={user => user.id}
            />
            {canCreateGroup && <FAB
                style={styles.fab}
                size="small"
                disabled={!isValidUserNumber()}
                color={Colors.light.sekhmetGreen}
                title={"Suivant"}
                icon={{name: "comment", color: "white"}}
                onPress={enterGroupName}
            />}
        </View>
        <AlertPrompt
            isVisible={isPromptVisible}
            title="Nom du groupe"
            placeholder='Entrer un nom pour le groupe'
            message="Entrer un nom pour le groupe"
            onCancelLabel="Annuler"
            onSubmitLabel="Créer le groupe"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        />
    </View>;
}

const styles = StyleSheet.create({
    inputText: {
        height: 40,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        marginBottom: 10,
        fontSize: 16,
    },
    view: {marginRight: 20, marginLeft: 20, marginTop: 20, flexDirection: "column", height: "100%"},
    fab: {
        position: 'absolute',
        margin: 16,
        right: 95,
        bottom: 50,
    }
});
