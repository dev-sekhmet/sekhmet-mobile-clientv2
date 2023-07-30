import React from "react";
import {Text, View} from "./Themed";
import Colors from "../constants/Colors";
import {IUser} from "../shared/user.model";
import {TWILIO_ROLE} from "../constants/Type";
import {Icon, ListItem} from "@rneui/themed";
import SekhmetAvatar from "./SekhmetAvatar";
import useAccount from "../hooks/useAccount";
import {getUserFullName} from "../shared/user.utils";


export default function UserItem({user, execSelection, isUserSelected}:
                                     {
                                         user: IUser,
                                         execSelection: (user: IUser, isSelected: boolean) => void,
                                         isUserSelected?: boolean
                                     }) {
    const {account} = useAccount();


    const getUserRole = () => {
        return user?.twilioRole === TWILIO_ROLE.CHANNEL_ADMIN ? 'Admin' : '';
    }

    return (
        <ListItem
            bottomDivider
            key={user.id}
            containerStyle={{backgroundColor: isUserSelected ? '#F6FFEC' : 'white'}}
            onPress={() => {
                execSelection(user, !isUserSelected);
            }}>

            <SekhmetAvatar
                size={40}
                key={user?.imageUrl}
                title={user?.firstName?.charAt(0)}
                imageUrl="https://randomuser.me/api/portraits/men/36.jpg"/>

            <ListItem.Content>
                <ListItem.Title>{getUserFullName(user)}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title style={{marginLeft: 10, color: Colors.light.sekhmetGreen}}>{getUserRole()}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
}
