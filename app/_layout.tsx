import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect as useReactEffect } from 'react';
import { loadFavorites } from './store/favoritesSlice';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();


//Deeplinking configuration
export const linking = {
  prefixes: [
    'myshoplite://',
    'ecommerceapp://',
    'https://localhost',
    'http://localhost',
    'https://*',
    'http://*',
  ],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          index: '',
          favorites: 'favorites',
        },
      },
      'product-details': 'product/:id',
    },
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Hydrates favorites from AsyncStorage on app start
  useReactEffect(() => {
    store.dispatch(loadFavorites());
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product-details" />
      </Stack>
    </ThemeProvider>
  );
}
