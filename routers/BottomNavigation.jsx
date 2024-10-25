import React from "react";
import { Home, Oraculos, Oraculos2, Profile } from "../screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Header, Icon, Text } from "react-native-magnus";
import { HeaderDetails } from "../components";

const genericHeader = () => <Header pt={"2xl"} shadow={"none"} />;

const BottomRoutes = {
  HOME: {
    unmountOnBlur: false,
    name: "Inicio",
    Component: Home,
    header: () => <></>,
    icon: {
      name: "home",
      fontFamily: "Foundation",
    },
    label: "Inicio",
  },
  ORACULOS: {
    unmountOnBlur: true,
    Component: Oraculos,
    // header: () => <></>,
    name: "oraculos",
    icon: {
      name: "sunny",
      fontFamily: "MaterialIcons",
    },
    label: "Oraculos",
  },
  ORACULOS2: {
    unmountOnBlur: true,
    Component: Oraculos2,
    // header: () => <></>,
    name: "oraculos2",
    icon: {
      name: "cards-playing-club",
      fontFamily: "MaterialCommunityIcons",
    },
    label: "Horoscopo",
  },
  PROFILE: {
    unmountOnBlur: true,
    Component: Profile,
    header: genericHeader,
    name: "profile",
    icon: {
      name: "account",
      fontFamily: "MaterialCommunityIcons",
    },
    label: "Perfil",
  },
};

const Tab = createBottomTabNavigator();

const screens = BottomRoutes ? Object.values(BottomRoutes) : [];

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      {screens.map(
        ({ Component, name, icon, label, header, unmountOnBlur }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={Component}
            options={{
              header,
              tabBarHideOnKeyboard: true,
              headerShadowVisible: false,
              tabBarStyle: {
                height: 60,
                paddingBottom: 5,
              },
              unmountOnBlur,
              tabBarLabelStyle: {
                fontSize: 12,
                lineHeight: 14.7,
                fontFamily: "Bold",
              },
              headerShown: !!header,
              tabBarActiveTintColor: "secondary",
              tabBarInactiveTintColor: "gray",
              tabBarLabel: ({ color }) => (
                <Text color={color} fontFamily="Bold">
                  {label}
                </Text>
              ),
              tabBarIcon: ({ color }) => (
                <Icon
                  color={color}
                  name={icon.name}
                  fontFamily={icon.fontFamily}
                  fontSize={25}
                />
              ),
            }}
          />
        )
      )}
    </Tab.Navigator>
  );
};

export default BottomNavigation;
