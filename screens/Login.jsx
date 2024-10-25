import React, { useEffect, useState } from "react";
import { Dimensions, Pressable } from "react-native";
import {
  Box,
  Text,
  ScrollDiv,
  Input,
  Button,
  Image,
} from "react-native-magnus";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import useForm from "../hooks/useForm";
import useAuthStore from "../stores/useAuthStore";
import * as WebBrowser from "expo-web-browser";
import { useSocket } from "../contexts";
import { api } from "../axios";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const { form, setForm } = useForm({});
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  const { socket } = useSocket();

  const handleSubmit = async () => {
    setLoading(true);
    await login(form);
    setLoading(false);
  };

  useEffect(() => {
    const handleLoguinGoogle = (session) => {
      WebBrowser.dismissBrowser();

      api.loadCredentials(restoreSession, session);
    };

    if (socket) {
      socket.on("google-login", handleLoguinGoogle);
    }

    return () => {
      if (socket) socket.off("google-login", handleLoguinGoogle);
    };
  }, [socket, restoreSession]);

  return (
    <ScrollDiv
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        textAlign="left"
        w={"90%"}
        my={"2xl"}
        fontWeight="bold"
        fontSize={"4xl"}
        fontFamily="Bold"
        color="#545252"
      >
        ¡Feliz de verte!
      </Text>

      <Input
        inputMode="email"
        onChangeText={(value) => setForm("email", value)}
        fontFamily="Regular"
        w={"90%"}
        placeholder="Email"
        my={"lg"}
        borderWidth={2}
      />

      <Input
        onChangeText={(value) => setForm("password", value)}
        fontFamily="Regular"
        w={"90%"}
        placeholder="Contraseña"
        my={"lg"}
        secureTextEntry={true}
        borderWidth={2}
      />

      <Box w={"90%"}>
        <Pressable
          onPress={() => navigation.navigate(stackRoutesNames.RECOVER)}
        >
          <Text
            fontFamily="Bold"
            mt={"lg"}
            mb={"2xl"}
            color="visited"
            textAlign="right"
          >
            ¿Perdiste la contraseña?
          </Text>
        </Pressable>
      </Box>

      <Button
        loading={loading}
        loaderColor="visited"
        loaderSize={35}
        onPress={handleSubmit}
        shadow="xl"
        fontSize={"2xl"}
        shadowColor="primary"
        bg="primary"
        color="#000"
        fontFamily="Bold"
        h={50}
        w={"90%"}
        alignSelf="center"
        rounded={35}
      >
        Iniciar sesión
      </Button>

      <Button
        bg="transparent"
        alignSelf="center"
        my={"lg"}
        onPress={() => navigation.navigate(stackRoutesNames.REGISTER)}
      >
        <Text fontFamily="Bold" color="#000" fontSize={"xl"}>
          Registrate
        </Text>
      </Button>

      <Box flexDir="row" alignItems="center" mt={"xl"} mb={"2xl"}>
        <Box w={"30%"} bg="#545252" h={3} />
        <Text mx={5} color="#545252">
          Únete con
        </Text>
        <Box w={"30%"} bg="#545252" h={3} />
      </Box>

      <Button
        w={"90%"}
        rounded={15}
        onPress={() =>
          WebBrowser.openAuthSessionAsync(
            `${process.env.EXPO_PUBLIC_WEB_URL}?id=${socket.id}`
          )
        }
        alignSelf="center"
        bg="#fff"
        borderWidth={1}
        borderColor="#545252"
      >
        <Box w={width * 0.9} justifyContent="center" alignItems="center">
          <Image
            source={require("../resources/google_icon.png")}
            h={25}
            w={25}
            position="absolute"
            left={15}
          />
          <Text color="#545252" fontWeight="500">
            Google
          </Text>
        </Box>
      </Button>
    </ScrollDiv>
  );
};

export default Login;
