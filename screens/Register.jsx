import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  Box,
  Text,
  ScrollDiv,
  Input,
  Button,
  Image,
} from "react-native-magnus";
import { useForm } from "../hooks";
import { registerUser } from "../services";
import { emailRegex, passwordRegex } from "../helpers";
import * as WebBrowser from "expo-web-browser";
import { useSocket } from "../contexts";

const { width, height } = Dimensions.get("window");

const handleSubmit =
  ({ form, errors, setLoading }) =>
  () => {
    const isReady =
      Object.keys(errors).length === 0 && Object.values(form).some((e) => !!e);

    if (isReady) {
      setLoading(true);

      const format = { ...form, role: "USER_REGULAR" };

      registerUser(format).finally(() => setLoading(false));
    }
  };

const validations = {
  email: {
    check: (value) => value && emailRegex.test(value),
    message: "Debes ingresar un email válido",
  },
  userName: {
    check: (value) => {
      const lettersCount = (value.match(/[a-zA-Z]/g) || []).length;
      const numbersCount = (value.match(/\d/g) || []).length;
      const hasMoreLetters = lettersCount > numbersCount;
      const hasMinimumLength = value.length >= 3;
      return hasMoreLetters && hasMinimumLength;
    },
    message: "Nombre de usuario no válido",
  },

  password: {
    check: (value) => value && passwordRegex.test(value),
    message: `La contraseña debe tener al menos 6 caracteres, ${"\n"} una letra mayúscula y un número.`,
  },
  repeat: {
    check: (value) => value && !!value,
    equal: "password",
    message: "Las contraseñas no coinciden",
  },
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { form, setForm, errors } = useForm({
    validations,
    initialValues: {},
  });

  const { socket } = useSocket();

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
        fontFamily="Bold"
        textAlign="left"
        w={"90%"}
        my={"2xl"}
        fontSize={"4xl"}
        fontWeight="400"
        color="#545252"
      >
        ¡Ya falta menos!
      </Text>

      <Input
        fontFamily="Regular"
        value={form.userName}
        onChangeText={(value) => setForm("userName", value)}
        w={"90%"}
        placeholder="Nombre de usuario"
        my={"lg"}
        borderWidth={2}
      />
      {errors.userName && <Text fontFamily="Light">{errors.userName}</Text>}

      <Input
        fontFamily="Regular"
        value={form.email}
        onChangeText={(value) => setForm("email", value)}
        w={"90%"}
        placeholder="Email"
        my={"lg"}
        borderWidth={2}
      />

      {errors.email && <Text fontFamily="Light">{errors.email}</Text>}

      <Input
        fontFamily="Regular"
        value={form.password}
        onChangeText={(value) => setForm("password", value)}
        w={"90%"}
        placeholder="Contraseña"
        my={"lg"}
        secureTextEntry={true}
        borderWidth={2}
      />
      {errors.password && <Text fontFamily="Light">{errors.password}</Text>}

      <Input
        fontFamily="Regular"
        value={form.repeat}
        onChangeText={(value) => setForm("repeat", value)}
        w={"90%"}
        placeholder="Repetir contraseña"
        my={"lg"}
        secureTextEntry={true}
        borderWidth={2}
      />
      {errors.repeat && <Text fontFamily="Light">{errors.repeat}</Text>}

      <Text mt={"lg"} mb={"2xl"}>
        Al continuar usted acepta los{" "}
        <Text fontWeight="500" color="accent">
          terminos y condiciones.
        </Text>
      </Text>

      <Button
        onPress={handleSubmit({ form, errors, setLoading })}
        shadow="xl"
        fontSize={"2xl"}
        shadowColor="primary"
        bg="primary"
        color="#000"
        fontWeight="bold"
        loading={loading}
        h={50}
        w={"90%"}
        alignSelf="center"
        rounded={35}
      >
        Crear una Cuenta
      </Button>

      <Box flexDir="row" alignItems="center" mt={"xl"} mb={"2xl"}>
        <Box w={"30%"} bg="#545252" h={3} />
        <Text mx={5} color="#545252">
          Regístrate con
        </Text>
        <Box w={"30%"} bg="#545252" h={3} />
      </Box>

      <Button
        onPress={() =>
          WebBrowser.openAuthSessionAsync(
            `${process.env.EXPO_PUBLIC_WEB_URL}?id=${socket.id}`
          )
        }
        w={"90%"}
        rounded={15}
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

export default Register;
