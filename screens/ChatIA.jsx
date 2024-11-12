import React, { useState, useCallback, useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, Animated, Image, View } from "react-native";
import { Box, Icon, Text, Button } from "react-native-magnus";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { handleOraculo } from "../services";
import { useForm } from "../hooks";
import { customTheme } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ChatIA = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedCardCount, selectedCardNames } = route.params;
  const [showCards, setShowCards] = useState(false)

  const { setForm, form, clear } = useForm({
    initialValues: { message: "" },
    validations: {},
  });


  const images = [
    { source: require("../resources/cards/1.loco.jpg"), name: "Loco" },
    { source: require("../resources/cards/2.mago.jpg"), name: "Mago" },
    { source: require("../resources/cards/3.sacerdotista.jpg"), name: "Sacerdotista" },
    { source: require("../resources/cards/4.emperatriz.jpg"), name: "Emperatriz" },
    { source: require("../resources/cards/5.emperador.jpg"), name: "Emperador" },
    { source: require("../resources/cards/6.sumo_sacerdote.jpg"), name: "Sumo Sacerdote" },
    { source: require("../resources/cards/7.enamorado.jpg"), name: "Enamorado" },
    { source: require("../resources/cards/8.carro.jpg"), name: "Carro" },
    { source: require("../resources/cards/9.justucia.jpg"), name: "Justucia" },
    { source: require("../resources/cards/10.ermitano.jpg"), name: "Ermitaño" },
    { source: require("../resources/cards/11.fortuna.jpg"), name: "Rueda de la Fortuna" },
    { source: require("../resources/cards/12.fuerza.jpg"), name: "Fuerza" },
    { source: require("../resources/cards/13.colgado.jpg"), name: "El Colgado" },
    { source: require("../resources/cards/14.xiii.jpg"), name: "La Muerte" },
    { source: require("../resources/cards/15.templanza.jpg"), name: "Templanza" },
    { source: require("../resources/cards/16.diablo.jpg"), name: "Diablo" },
    { source: require("../resources/cards/17.torre.jpg"), name: "La Torre" },
    { source: require("../resources/cards/18.estrella.jpg"), name: "Estrella" },
    { source: require("../resources/cards/19.luna.jpg"), name: "La Luna" },
    { source: require("../resources/cards/20.sol.jpg"), name: "El Sol" },
    { source: require("../resources/cards/21.juicio.jpg"), name: "Juicio" },
    { source: require("../resources/cards/22.mundo.jpg"), name: "El Mundo" },
  ];

  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[newMessages.length - 1];

      // Agregar el mensaje del usuario al chat
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      // Crear el array lastMessages con los objetos { role, content }
      const lastMessages = [...messages, message].map((msg) => ({
        role: msg.user._id === 1 ? "user" : "assistant",
        content: msg.text,
      }));

      // Llamar a la función que se comunica con el backend (oráculo)
      setLoading(true);
      const { response } = await handleOraculo({ form: message, clear, setLoading, lastMessages, selectedCardNames });

      // Agregar la respuesta de la IA al chat
      const responseMessage = {
        _id: Math.random(),
        text: response,
        createdAt: new Date(),
        user: { _id: 2, name: "IA" },
      };

      // Filtrar las imágenes según las cartas seleccionadas
      const filteredImages = images.filter((image) =>
        selectedCardNames.includes(image.name)
      );

      console.log('FILTERED:', filteredImages);

      // Mapear los números de `source` en `filteredImages` a las rutas de imágenes reales
      const imageMessages = filteredImages.map((image, index) => ({
        _id: Math.random(),
        image: image.source,  // Ahora `image.source` es una ruta válida
        createdAt: new Date(),
        user: { _id: 2, name: "IA" },
      }));

      // Si se han filtrado imágenes, agregarlas al chat
      if (imageMessages.length > 0) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, imageMessages));
      }

      // Agregar la respuesta de IA al chat
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [responseMessage]));
      setLoading(false);
    },
    [messages, form, clear]
  );


  // const onSend = useCallback(
  //   async (newMessages = []) => {
  //     const message = newMessages[newMessages.length - 1];

  //     // Agregar el mensaje del usuario al chat
  //     setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

  //     // Crear el array lastMessages con los objetos { role, content }
  //     const lastMessages = [...messages, message].map((msg) => ({
  //       role: msg.user._id === 1 ? "user" : "assistant",
  //       content: msg.text,
  //     }));

  //     // Llamar a la función que se comunica con el backend (oráculo)
  //     setLoading(true);
  //     const { response } = await handleOraculo({ form: message, clear, setLoading, lastMessages, selectedCardNames });

  //     // Agregar la respuesta de la IA al chat
  //     const responseMessage = {
  //       _id: Math.random(),
  //       text: response,
  //       createdAt: new Date(),
  //       user: { _id: 2, name: "IA" },
  //     };

  //     const filteredImages = images.filter(image =>
  //       selectedCardNames.includes(image.name)
  //     );

  //     console.log('FILTERED:', filteredImages);

  //     // Agregar imágenes solo si messages.length > 1
  //     if (messages.length > 1) {
  //       const imageMessages = filteredImages.map((image, index) => ({
  //         _id: Math.random(),
  //         image: image.source,
  //         createdAt: new Date(),
  //         user: { _id: 2, name: "IA" },
  //       }));

  //       setMessages((previousMessages) => GiftedChat.append(previousMessages, imageMessages));
  //     }

  //     setMessages((previousMessages) => GiftedChat.append(previousMessages, [responseMessage]));
  //     setLoading(false);
  //   },
  //   [messages, form, clear]
  // )


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

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#591970",
          },
          left: {
            backgroundColor: "#5a338c",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
          left: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const renderMessageImage = (props) => {
    // console.log('props', props);

    return (
      <View>
        <Image
          source={props.currentMessage.image}
          style={{
            width: 100,
            height: 150,
            borderRadius: 8,
            margin: 10,
            resizeMode: 'contain'
          }}
        />
      </View>
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

        <Box w={"100%"} alignItems="center" mt={20} position="absolute" opacity={0.4}>
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
            _id: 1,
          }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          alwaysShowSend={true}
          placeholder="Haz tu pregunta"
          containerStyle={{ marginBottom: 0 }}
          textInputStyle={{
            color: "#000",
            backgroundColor: "#e6e6e6",
            borderRadius: 20,
            paddingHorizontal: 20,
          }}
        />

        {/* {loading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform={[{ translateX: -50 }, { translateY: -50 }]}
          >
            <Text>Loading...</Text>
          </Box>
        )} */}
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
