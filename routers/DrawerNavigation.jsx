import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomDrawerContent } from "../components";
import { useNavigationStore } from "../stores";
import { Settings } from "../screens";
import BottomNavigation from "./BottomNavigation";

const DrawerRoutes = {
  HOME: {
    name: "Inicio",
    Component: BottomNavigation,
    header: true,
  },
  SETTINGS: {
    name: "Configuración",
    Component: Settings,
    header: true,
  },
};

const Drawer = createDrawerNavigator();

const screens = DrawerRoutes ? Object.values(DrawerRoutes) : [];

const DrawerNavigation = ({ navigation }) => {
  const setNavigationStack = useNavigationStore(
    (state) => state.setStackNavigation
  );

  useEffect(() => {
    setNavigationStack(navigation);
    return () => setNavigationStack(null);
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} stackNavigation={navigation} />
      )}
    >
      {screens.map(({ Component, name, header }) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={Component}
          options={{
            headerShown: header,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
