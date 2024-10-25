import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Dimensions, KeyboardAvoidingView } from "react-native";
import { Box, Icon, Image, Input, Overlay, Text } from "react-native-magnus";
import { useForm } from "../hooks";
import { handleOraculo } from "../services";
import { customTheme } from "../theme";

const { width, height } = Dimensions.get("window");

const Oraculos = () => {
  const [loading, setLoading] = useState(false);

  const { setForm, form, clear } = useForm({
    initialValues: { message: "" },
    validations: {},
  });

  return (
    <Box w={"100%"} h={"100%"}>
      <Image
        position="absolute"
        source={require("../resources/bg_oracles.png")}
        w={width}
        h={height}
      />

      <Image
        source={require("../resources/4.png")}
        w={60}
        h={80}
        top={10}
        left={60}
        position="absolute"
        resizeMode="contain"
      />

      <Image
        source={require("../resources/hearth.png")}
        w={60}
        h={60}
        top={80}
        left={15}
        resizeMode="contain"
        position="absolute"
        zIndex={1}
      />

      <Image
        source={require("../resources/hearth_reverse.png")}
        w={60}
        h={60}
        bottom={80}
        right={15}
        resizeMode="contain"
        position="absolute"
        zIndex={1}
      />

      <Image
        source={require("../resources/num_circle.png")}
        position="absolute"
        right={15}
        top={50}
        w={60}
        h={60}
        zIndex={1}
      />

      <Overlay visible={loading}>
        <ActivityIndicator color={customTheme.colors.primary} />
        <Text mt="md">Loading...</Text>
      </Overlay>

      <KeyboardAvoidingView
        style={style.keyboardAvoidingView}
        contentContainerStyle={{ zIndex: 2 }}
      >
        <Box alignSelf="center">
          <Input
            value={form.message}
            onChangeText={(value) => setForm("message", value)}
            placeholder="Haz tu pregunta"
            fontFamily="Regular"
            color="gray"
            h={40}
            w={"90%"}
            suffix={
              loading ? (
                <ActivityIndicator />
              ) : (
                <Pressable onPress={handleOraculo({ form, clear, setLoading })}>
                  <Icon name="send" fontFamily="MaterialCommunityIcons" />
                </Pressable>
              )
            }
          />
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
};

const style = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    bottom: 15,
    width: "100%",
  },
});

export default Oraculos;
