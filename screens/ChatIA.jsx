import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Dimensions, KeyboardAvoidingView } from "react-native";
import { Box, Icon, Image, Input, Overlay, Text } from "react-native-magnus";
import { useForm } from "../hooks";
import { handleOraculo } from "../services";
import { customTheme } from "../theme";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const ChatIA = () => {
  const [loading, setLoading] = useState(false);

  const { setForm, form, clear } = useForm({
    initialValues: { message: "" },
    validations: {},
  });

  return (
    <Box w={"100%"} h={"100%"}>
      <Image
        position="absolute"
        source={require("../resources/chatia_bg.webp")}
        w={width}
        h={'100%'}
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

export default ChatIA;