import React, { useState, useCallback, useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, Animated, Image } from "react-native";
import { Box, Icon, Text, Button } from "react-native-magnus";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { handleOraculo } from "../services"; // Se mantiene el servicio para manejar la API
import { useForm } from "../hooks";
import { customTheme } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ChatIA = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedCardCount, selectedCardNames } = route.params;

  const { setForm, form, clear } = useForm({
    initialValues: { message: "" },
    validations: {},
  });

  // Función para manejar el envío de mensajes
  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[newMessages.length - 1];

      // Agregar el mensaje del usuario al chat
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      // Llamar a la función que se comunica con el backend (oráculo)
      setLoading(true);
      const { response } = await handleOraculo({ form: message, clear, setLoading });

      // Agregar la respuesta de la IA al chat
      const responseMessage = {
        _id: Math.random(), // Genera un ID único para la respuesta
        text: response,
        createdAt: new Date(),
        user: { _id: 2, name: "IA" },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [responseMessage]));
      setLoading(false);
    },
    [form, clear]
  );

  // Función para simular la carga de mensajes (si es necesario)
  const fetchMessages = async () => {
    setMessages([
      {
        _id: 1,
        text: "Bienvenido al espacio de reflexión, por favor formula tu pregunta para poder ayudarte.",
        createdAt: new Date(),
        user: { _id: 2, name: "IA" },
      },
    ]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderSend = (props) => {
    return (
      <Button
        bg="transparent"
        color="white"
        rounded="xl"
        onPress={() => {
          if (props.text && props.onSend) {
            props.onSend({ text: props.text.trim() }, true);
          }
        }}
      >
        <Icon name="send" fontFamily="Ionicons" fontSize={22} color="#09f" />
      </Button>
    );
  };

  // Función para formatear la hora sin los segundos
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Formato HH:mm
  };

  // Personalización de burbujas de mensajes
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#591970", // Color para el emisor (usuario)
          },
          left: {
            backgroundColor: "#5a338c", // Color para el receptor (IA)
          },
        }}
        textStyle={{
          right: {
            color: "#fff", // Texto blanco para el emisor
          },
          left: {
            color: "#fff", // Texto negro para el receptor
          },
        }}

      // renderTime={(props) => (
      //   // <Text style={{ color: '#fff', fontSize: 12, marginLeft: 10, marginRight: 10, marginBottom: 5 }}> {/* Color personalizado para la hora */}
      //   //   {/* {props.currentMessage.createdAt.toLocaleTimeString()} */}
      //   //   {/* {formatTime(props.currentMessage.createdAt)} */}
      //   // </Text>
      // )}
      />
    );
  };

  return (
    <SafeAreaView>
      <Box w={"100%"} h={"100%"} bg="#191970">
        <Animated.Image
          source={require("../resources/chatia_bg.webp")}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            opacity: 0.3,
          }}
        />

        <Box
          position="absolute"
          width="100%"
          height="100%"
          bg="purple500"
          opacity={0.3}
          zIndex={-1}
        />

        <Box w={"100%"} alignItems="center" mt={20}>
          <Box bg="#1f1f1f" w={"70%"} p={10} borderRadius={10}>
            <Box flexDir="row" alignItems="center" justifyContent="center" mb={5}>
              <Text color="green" mr={5}>●</Text>
              <Text color="white">Maestro Arcano</Text>
            </Box>
            <Text color="white" textAlign="center">Sabio y Calido. Maestro Arcano combina conocimiento ancestral y humor en cada lectura.</Text>
          </Box>
        </Box>

        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1, // Identificador del usuario
          }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          alwaysShowSend={true}
          placeholder="Haz tu pregunta"
          containerStyle={{ marginBottom: 0, marginTop: 20 }}
          textInputStyle={{
            color: "#000",
            backgroundColor: "#e6e6e6",
            borderRadius: 20,
            paddingHorizontal: 20,
          }}
        />

        {loading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform={[{ translateX: -50 }, { translateY: -50 }]}
          >
            <Text>Loading...</Text>
          </Box>
        )}
      </Box>
    </SafeAreaView>
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
