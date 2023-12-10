import {Dimensions, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {Conversation} from "@twilio/conversations";
import Colors from "../../../../constants/Colors";
import {Text, View} from "../../../../components/Themed";
import {Badge} from "@rneui/base";
import SekhmetActivityIndicator from "../../../../components/SekhmetActivityIndicator";
import {CONVERSATION_TYPE} from "../../../../constants/Type";
import {AppContext} from "../../../../components/AppContext";
import ConversationList from "../../../../components/ConversationList";

const height = Dimensions.get('screen').height;

export default function MessagesScreen() {
    const context = useContext(AppContext);

    if (!context) {
        return <SekhmetActivityIndicator/>
    }
    const {
        account,
        twilioClient,
        conversations,
        loadingConversations,
        fetchMoreConversations,
        fetchMoreMessages,
        messagePaginator,
    } = context;

    const [dualConversations, setDualConversations] = useState<Conversation[]>([]);
    const [groupConversations, setGroupConversations] = useState<Conversation[]>([]);


    useEffect(() => {
        // @ts-ignore
        setDualConversations(conversations); // assuming 'private' conversations are dual conversations
        // @ts-ignore
        //setGroupConversations(conversations.filter(c =>  c.attributes['type'] === 'group')); // assuming 'public' conversations are group conversations
    }, [conversations]);

    useEffect(() => {
        return () => {
            twilioClient?.removeAllListeners();
        }
    }, [])


  const Tab = createMaterialTopTabNavigator();

  return (
      <Tab.Navigator initialRouteName={"Discussion"}
                     screenOptions={{
                       tabBarActiveTintColor: Colors.light.sekhmetGreen,
                       tabBarIndicatorStyle: {backgroundColor: Colors.light.sekhmetGreen},
                       tabBarLabelStyle: {fontSize: 12, backgroundColor:'white'},
                     }}
      >
        <Tab.Screen name="Discussion"
                    options={{
                      tabBarLabel: () => {
                        const count = 1;
                        return <View style={styles.tabItem}>
                          <Text style={{color: Colors.light.sekhmetGreen}}>Discussions</Text>
                          {count > 0 && <Badge value={count} badgeStyle={{
                            marginVertical: 10,
                            backgroundColor: Colors.light.sekhmetGreen
                          }}/>}
                        </View>;
                      }
                    }}
                    children={() => <ConversationList
                        onScroll={fetchMoreConversations}
                        loadingConversations={loadingConversations}
                        conversations={dualConversations}
                        conversationInfo={{label: "Nouvelle discussion", type: CONVERSATION_TYPE.DUAL}}/>}/>
        <Tab.Screen name="Groupes"
                    options={{
                      tabBarLabel: () => {
                        const count = 1;
                        return <View style={styles.tabItem}>
                          <Text style={{color: Colors.light.sekhmetGreen}}>Groupes</Text>
                          {count > 0 && <Badge
                              value={count}
                              badgeStyle={{marginVertical: 10, backgroundColor: Colors.light.sekhmetGreen}}
                          />}
                        </View>
                      }
                    }}
                    children={() => <ConversationList
                        onScroll={fetchMoreConversations}
                        loadingConversations={loadingConversations}
                        conversations={groupConversations}
                        conversationInfo={{label: "Nouveau Groupe", type: CONVERSATION_TYPE.GROUP}}/>}/>

      </Tab.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 120,
    alignItems: 'center',
  }
});
