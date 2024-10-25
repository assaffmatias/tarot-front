import React, { useState } from "react";
import { KeyboardAvoidingView, Pressable } from "react-native";
import { Box, Button, Icon, Input, Text } from "react-native-magnus";
import { useRoute } from "@react-navigation/native";
import { publishComment } from "../services";

const FormComment = ({ handleClose, setForm, form, ready }) => {
  const route = useRoute();

  const [loading, setLoading] = useState(false);

  const { data = {} } = route.params;

  return (
    <>
      <Box w={"100%"} alignSelf="Center" h={1} my={"sm"} bg="primary" />

      <Text fontFamily="Medium" fontSize={"lg"} my={"sm"}>
        Comente aquí
      </Text>

      <KeyboardAvoidingView behavior={"height"} keyboardVerticalOffset={0}>
        <Input
          onChangeText={(value) => setForm("message", value)}
          my={"sm"}
          textAlignVertical="center"
          keyboardType="default"
          placeholder="Reseña"
          fontFamily="Medium"
        />
      </KeyboardAvoidingView>

      <Text fontFamily="Medium" my={"sm"} fontSize={"lg"}>
        Puntuar
      </Text>
      <Box flexDir="row">
        {Array(5)
          .fill({})
          .map((_, key) => (
            <Pressable key={key} onPress={() => setForm("rate", key + 1)}>
              <Icon
                mx={"sm"}
                fontSize={25}
                color={form.rate >= key + 1 ? "primary" : "gray500"}
                name="star"
              />
            </Pressable>
          ))}
      </Box>

      <Button
        loading={loading}
        onPress={publishComment({
          form,
          handleClose,
          id: data._id,
          ready,
          setLoading,
        })}
        fontFamily="Bold"
        rounded={10}
        mt={"2xl"}
      >
        Publicar
      </Button>
    </>
  );
};

export default FormComment;
