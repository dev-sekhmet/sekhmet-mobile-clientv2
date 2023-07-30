import {Stack} from 'expo-router';
import {useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export default function ConversationLayout() {
    const colorScheme = useColorScheme();

    return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen name="conversations" options={{headerShown: false}}/>
            <Stack.Screen name="create-conversation" options={{
                headerShadowVisible: false,
                headerStyle: {backgroundColor: 'white'},
                presentation: 'modal'
            }}/>
        </Stack>
    </ThemeProvider>;

}
