import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {Conversation, Message} from "@twilio/conversations";
import Colors from "../../../../constants/Colors";
import {Text, View} from "../../../../components/Themed";
import {Badge} from "@rneui/base";
import SekhmetActivityIndicator from "../../../../components/SekhmetActivityIndicator";
import {CONVERSATION_TYPE} from "../../../../constants/Type";
import ChatItem from "../../../../components/ChatItem";
import NewConversation from "../../../../components/NewConversation";
import {AppContext} from "../../../../components/AppContext";

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
                    children={() => <Discussion
                        onScroll={fetchMoreConversations}
                        loadingConversations={loadingConversations}
                        conversations={dualConversations}/>}/>
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
                    children={() => <Groupes
                        onScroll={fetchMoreConversations}
                        loadingConversations={loadingConversations}
                        conversations={groupConversations}/>}/>

      </Tab.Navigator>

  );
}


const Discussion = ({conversations, onScroll, loadingConversations}: {
    conversations?: Conversation[],
    onScroll: any,
    loadingConversations?: boolean
}) => {
    const context = useContext(AppContext);

    if (!context) {
        return <SekhmetActivityIndicator/>
    }
    const {
        messages,
    } = context;

    const getLastMessage = (conversationSid: string) => {
        const conversationMessages = messages?.get(conversationSid);
        if (conversationMessages && conversationMessages.length > 0) {
            return conversationMessages[conversationMessages.length-1];
        }
        return undefined;
    }
    return <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => {
                const unreadMessagesCount = 2;
                const lastMessage = getLastMessage(item.sid);
                return (
                    <ChatItem
                        key={item.sid}
                        conversation={item}
                        lastMessage={lastMessage}
                        unreadMessagesCount={unreadMessagesCount}/>
                );
            }}
            onEndReached={onScroll}
            onEndReachedThreshold={0.2}
            keyExtractor={item => item.sid}
        />
        <NewConversation conversationInfo={{label: "Nouvelle discussion", type: CONVERSATION_TYPE.DUAL}}/>
    </View>
}

const Groupes = ({conversations, onScroll, loadingConversations}: {
    conversations?: Conversation[],
    onScroll: any,
    loadingConversations?: boolean
}) => {
    const context = useContext(AppContext);

    if (!context) {
        return <SekhmetActivityIndicator/>
    }
    const {
        messages,
    } = context;

    const getLastMessage = (conversationSid: string) => {
        const conversationMessages = messages?.get(conversationSid);
        if (conversationMessages && conversationMessages.length > 0) {
            return conversationMessages[0];
        }
        return undefined;
    }

    return <View style={styles.container}>
        <FlatList
            data={conversations}
            renderItem={({item}) => {
                const unreadMessagesCount = 3
                const lastMessage = getLastMessage(item.sid);
                return (
                    <ChatItem conversation={item}
                              lastMessage={lastMessage}
                              unreadMessagesCount={unreadMessagesCount}/>
                );
            }}
            onEndReached={onScroll}
            onEndReachedThreshold={0.2}
            keyExtractor={item => item.sid}
        />
        <NewConversation conversationInfo={{label: "Nouveau Groupe", type: CONVERSATION_TYPE.GROUP}}/>
    </View>
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
