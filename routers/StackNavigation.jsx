import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores";
import { api } from "../axios";
import {
  Chat,
  ChatIA,
  ChatList,
  Login,
  Notifications,
  PayService,
  Profile,
  Publications,
  Recover,
  Register,
  Verification,
  Wallet,
  Welcome,
} from "../screens";
import { stackRoutesNames } from "./stackRoutesNames";
import BottomNavigation from "./BottomNavigation";
import { SocketProvider } from "../contexts";
import { Details } from "../screens";
import PayCoins from "../screens/PayCoins";

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
    header: true,
  },
  PAY_SERVICE: {
    name: stackRoutesNames.PAY_SERVICE,
    Component: PayService,
    auth: true,
    header: false,
  },
  PAY_COINS: {
    name: stackRoutesNames.PAY_COINS,
    Component: PayCoins,
    auth: true,
    header: false,
  },
  CHAT_SERVICE: {
    name: stackRoutesNames.CHAT_SERVICE,
    Component: Chat,
    auth: true,
    header: false,
  },
  CHAT_LIST: {
    name: stackRoutesNames.CHAT_LIST,
    Component: ChatList,
    auth: true,
    header: true,
  },
  NOTIFICATIONS: {
    name: stackRoutesNames.NOTIFICATIONS,
    Component: Notifications,
    auth: true,
    header: true,
  },
  ChatIA: {
    name: stackRoutesNames.CHAT_IA,
    Component: ChatIA,
    auth: true,
    header: false,
  },
  PUBLICATIONS: {
    name: stackRoutesNames.PUBLICATIONS,
    Component: Publications,
    auth: true,
    header: true,
  },
  PROFILE: {
    name: stackRoutesNames.PROFILE,
    Component: Profile,
    auth: true,
    header: false,
  },
  WALLET: {
    name: stackRoutesNames.WALLET,
    Component: Wallet,
    auth: true,
    header: true,
  },
};

const Stack = createNativeStackNavigator();

const screens = Object.values(StackRoutes);

const getHeaderTitle = (screenName) => {
  switch (screenName) {
    case stackRoutesNames.CHAT_LIST:
      return "Chat";
    case stackRoutesNames.NOTIFICATIONS:
      return "Notificaciones";
    case stackRoutesNames.WALLET:
      return "Medios de Pago";
    case stackRoutesNames.PUBLICATIONS:
      return "Tu Publicación";
    default:
      return "Arcano"; // Título predeterminado
  }
};

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
              options={({ navigation, route }) => ({
                headerShown: header,
                headerTitle: getHeaderTitle(name),
                headerBackTitle: "Regresar",
                // headerStyle: {
                //   backgroundColor: "#f6e05e",
                // },
                headerTintColor: "#191970",
                headerTitleStyle: {
                  fontFamily: "Bold",
                  fontSize: 18,
                },
              })}
              component={Component}
              listeners={({ navigation }) => ({
                focus: () => {
                  if (auth && !authState) {
                    navigation.navigate(stackRoutesNames.LOGIN);
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
