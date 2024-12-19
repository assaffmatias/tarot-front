import { ThemeProvider } from "react-native-magnus";
import { StackNavigation } from "./routers";
import { NavigationContainer } from "@react-navigation/native";
import { customTheme } from "./theme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { api } from "./axios";
import { useAuthStore } from "./stores";
import { navigationRef } from "./helpers";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  const [fontsLoaded, fontError] = useFonts({
    Bold: require("./fonts/Gilroy-Bold.ttf"),
    Heavy: require("./fonts/Gilroy-Heavy.ttf"),
    Light: require("./fonts/Gilroy-Light.ttf"),
    Medium: require("./fonts/Gilroy-Medium.ttf"),
    Regular: require("./fonts/Gilroy-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    api.loadCredentials(restoreSession);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider theme={customTheme}>
          <NavigationContainer ref={navigationRef}>
            <StackNavigation />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
