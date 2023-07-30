import {Stack} from 'expo-router';
import {useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export default function ProfileLayout() {
    const colorScheme = useColorScheme();

    return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen name="profile" options={{headerShown: false}}/>
            <Stack.Screen name="personal-infos" options={{
                headerShadowVisible: false,
                headerStyle: {backgroundColor: 'white'},
                title:'infos personnelles',
                presentation: 'modal'
            }}/>
        </Stack>
    </ThemeProvider>;

}
