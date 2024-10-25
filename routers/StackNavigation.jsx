import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores";
import { api } from "../axios";
import {
  Chat,
  Login,
  PayService,
  Recover,
  Register,
  Verification,
  Welcome,
} from "../screens";
import { stackRoutesNames } from "./stackRoutesNames";
import BottomNavigation from "./BottomNavigation";
import { SocketProvider } from "../contexts";
import { Details } from "../screens";

const StackRoutes = {
  WELCOME: {
    name: stackRoutesNames.WELCOME,
    Component: Welcome,
    auth: false,
    header: false,
  },
  LOGIN: {
    name: stackRoutesNames.LOGIN,
    Component: Login,
    auth: false,
    header: false,
  },
  REGISTER: {
    name: stackRoutesNames.REGISTER,
    Component: Register,
    auth: false,
    header: false,
  },
  RECOVER: {
    name: stackRoutesNames.RECOVER,
    Component: Recover,
    auth: false,
    header: false,
  },
  HOME: {
    name: stackRoutesNames.HOME,
    Component: BottomNavigation,
    auth: true,
    header: false,
  },
  VERIFICATION: {
    name: stackRoutesNames.VERIFICATION,
    Component: Verification,
    auth: true,
    header: false,
  },
  DETAILS: {
    name: stackRoutesNames.DETAILS,
    Component: Details,
    auth: true,
    header: false,
  },
  PAY_SERVICE: {
    name: stackRoutesNames.PAY_SERVICE,
    Component: PayService,
    auth: true,
    header: false,
  },
  CHAT_SERVICE: {
    name: stackRoutesNames.CHAT_SERVICE,
    Component: Chat,
    auth: true,
    header: false,
  },
};

const Stack = createNativeStackNavigator();

const screens = Object.values(StackRoutes);

const AppRoutes = () => {
  const authState = useAuthStore((state) => state.auth);

  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    api.loadCredentials(restoreSession);
  }, []);

  return (
    <SocketProvider>
      <Stack.Navigator
        screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}
      >
        {screens
          .filter(({ auth }) => (authState ? auth : !auth))
          .map(({ Component, auth, name, header }) => (
            <Stack.Screen
              key={name}
              name={name}
              options={{ headerShown: header }}
              component={Component}
              listeners={({ navigation }) => ({
                focus: () => {
                  if (auth && !authState) {
                    navigation.navigate(screen_names.LOGIN);
                  }
                },
              })}
            />
          ))}
      </Stack.Navigator>
    </SocketProvider>
  );
};

export default AppRoutes;
