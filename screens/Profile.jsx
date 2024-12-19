import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  SectionList,
  StyleSheet,
} from "react-native";
import { Box, Button, Icon, Image, Skeleton, Text } from "react-native-magnus";
import { useAuthStore } from "../stores";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { navigate } from "../helpers";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { api } from "../axios";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const { height, width } = Dimensions.get("window");

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Progreso: ${percentCompleted}%`);
  },
};

const Profile = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.userInfo);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState(null);

  console.log('USER:', user);
  

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aceptar", onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    if (status.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        cameraType: "front",
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        const formData = new FormData();

        formData.append("img", {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].fileName,
          size: result.assets[0].fileSize,
        });

        await api.PUT(`/uploads/user/${user._id}`, formData, config);
      }
    } else {
      if (status.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert(
          "No tienes permisos",
          "la aplicación necesita permisos para poder continuar"
        );
      }
    }
  };

  const data = useMemo(() => {
    const menuItems = [
      {
        title: "Soporte",
        iconName: "support-agent",
        fontFamily: "MaterialIcons",
        action: () => Linking.openURL("mailto:soporte@arcanoapp.com"),
      },
      {
        title: "Cerrar Sesión",
        iconName: "log-out",
        fontFamily: "Feather",
        action: handleLogout,
      },
    ];
  
    // Agregar el ítem de publicación si el rol es "USER_TAROT"
    if (user?.role === "USER_TAROT") {
      menuItems.splice(1, 0, { // Inserta antes de "Cerrar Sesión"
        title: "Publicación",
        iconName: "popup",
        fontFamily: "Entypo",
        action: () => navigate(stackRoutesNames.PUBLICATIONS, {userid: user._id}),
      }, {
        title: "Medios de pago",
        iconName: "payment",
        fontFamily: "MaterialIcons",
        action: () => navigate(stackRoutesNames.WALLET, {userid: user._id})
      });
    }
  
    return [
      {
        title: "General",
        data: menuItems,
      },
    ];
  }, [logout]);
  

  return (
    <Box mt={0} h={height}>
      <Text
        color="#191970"
        textAlign="center"
        fontSize={25}
        fontFamily="Bold"
      >
        Perfil
      </Text>
      <Image
        alignSelf="center"
        loadingIndicatorSource={() => <Skeleton.Circle h={150} w={150} />}
        mt={"xl"}
        mb={"lg"}
        // source={{
        //   uri: user.img
        //     ? apiUrl + `${user.img}`
        //     : image || apiUrl + `/uploads/user/${user._id}`,
        // }}
        source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-wizard-holds-the-fire-as-he-walks-through-the-forest-image_2924861.jpg' }}
        w={150}
        h={150}
        rounded={100}
        borderColor="#191970"
        borderWidth={5}
      />
      <Pressable onPress={pickImage}>
        <Icon
          name="folder-upload"
          fontFamily="MaterialCommunityIcons"
          fontSize={25}
        />
      </Pressable>

      <Text
        fontFamily="Bold"
        color="#000"
        textAlign="center"
        mt={"xl"}
        mb={"sm"}
        fontSize={16}
      >
        {user.userName}
      </Text>

      {user.role !== "USER_TAROT" ? (
        <Button
          onPress={() => navigate(stackRoutesNames.VERIFICATION, {userid: user._id})}
          alignSelf="center"
          mt={"sm"}
          bg="secondary"
          color="#fff"
          fontFamily="Bold"
          rounded={10}
          fontSize={16}
        >
          ¡Ofrecer servicios!
        </Button>
      ) : (
        <Image
          source={require("../resources/verified_icon.png")}
          h={25}
          w={25}
          alignSelf="center"
        />
      )}

      <SectionList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContainer}
        sections={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <Pressable onPress={item.action}>
            <Box flexDir="row" alignItems="center" ml={20}>
              <Icon
                name={item.iconName}
                fontFamily={item.fontFamily}
                fontSize={35}
                color="#191970"
                mr="sm"
              />
              <Text fontFamily="Bold" fontSize={16} ml={5}>
                {item.title}
              </Text>
            </Box>
          </Pressable>
        )}
      />
    </Box>
  );
};

const style = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    width: width * 0.8,
    gap: 15,
    marginTop: 25,
  },
});

export default Profile;
