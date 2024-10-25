import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  Box,
  Button,
  Image,
  Input,
  ScrollDiv,
  Text,
} from "react-native-magnus";
import { useForm } from "../hooks";
import { emailRegex } from "../helpers";
import { recoverCode, recoverPassword } from "../services";

const { height } = Dimensions.get("window");

const validations = {
  email: {
    check: (value) => value && emailRegex.test(value),
    message: "Debes ser un email válido",
  },
};

const initialValues = { email: "", sended: false };

const handleEmailSubmit =
  ({ form, setForm, setLoading }) =>
  () => {
    if (!form.email) return;

    setLoading(true);
    recoverPassword(form)
      .then(() => setForm("sended", true))
      .finally(() => setLoading(false));
  };

const handleCodeSubmit =
  ({ form, setLoading }) =>
  () => {
    if (!form.code);
    setLoading(true);
    recoverCode(form).finally(() => setLoading(false));
  };

const Recover = () => {
  const { form, setForm, clear, errors } = useForm({
    initialValues,
    validations,
  });
  const [loading, setLoading] = useState(false);

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
        Recuperar contraseña
      </Text>

      {!form.sended && (
        <Input
          onChangeText={(value) => setForm("email", value)}
          fontFamily="Regular"
          w={"90%"}
          placeholder="Email"
          my={"lg"}
          keyboardType="email-address"
          borderWidth={2}
        />
      )}

      {form.sended && (
        <Input
          onChangeText={(value) => setForm("code", value)}
          variant="disabled"
          fontFamily="Regular"
          w={"90%"}
          placeholder="Código"
          my={"lg"}
          keyboardType="number-pad"
          borderWidth={2}
        />
      )}

      <Button
        mt={80}
        onPress={
          form.sended
            ? handleCodeSubmit({ form, setLoading })
            : handleEmailSubmit({ form, setLoading, setForm })
        }
        loading={loading}
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
        {form.sended ? "Iniciar sesión" : "Enviar email"}
      </Button>

      {form.sended && (
        <>
          <Text mt={"2xl"}>Si no recibes el email en los proximos minutos</Text>
          <Button
            onPress={clear}
            color="#000"
            bg="primary"
            rounded={50}
            alignSelf="center"
            mt={"xl"}
          >
            Reintentar
          </Button>
        </>
      )}
    </ScrollDiv>
  );
};

export default Recover;
