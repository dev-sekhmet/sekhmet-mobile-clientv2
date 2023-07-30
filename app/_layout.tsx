import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {SplashScreen, Stack} from 'expo-router';
import {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import Moment from "moment";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(main)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <ActionSheetProvider>
        <BottomSheetModalProvider>
          <RootLayoutNav/>
          <Toast/>
        </BottomSheetModalProvider>
      </ActionSheetProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    Moment.updateLocale('fr', {
      calendar: {
        sameDay: '[Aujourd\'hui]',
        nextDay: '[Demain]',
        nextWeek: 'dddd',
        lastDay: '[Hier]',
        lastWeek: 'dddd [dernier]',
        sameElse: 'DD/MM/YYYY'
      }
    })
  });


  return (

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(main)" options={{headerShown: false}}/>
            <Stack.Screen name="modal" options={{presentation: 'modal'}}/>
            <Stack.Screen name="onboarding" options={{headerShown: false}}/>
            <Stack.Screen name="terms-and-conditions" options={{headerShown: false}}/>
            <Stack.Screen name="input-phonenumber" options={{headerShown: false}}/>
            <Stack.Screen name="verify-phonenumber" options={{
              headerShadowVisible: false,
              headerStyle: {backgroundColor: 'white'},
              headerTitle: ''
            }}/>
            <Stack.Screen name="input-user-infos" options={{headerShown: false}}/>
            <Stack.Screen name="product-detail" options={{
              headerShadowVisible: false,
              headerStyle: {backgroundColor: 'white'},
              headerTitle: ''
            }}/>

            <Stack.Screen name="[...missing]" options={{
              headerShadowVisible: false,
              headerStyle: {backgroundColor: 'white'},
              headerTitle: ''
            }}/>
          </Stack>
        </ThemeProvider>
    );
}
