import React, { useState, useCallback, useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, Animated, Image, View, Modal, ScrollView, Keyboard, Pressable, Alert } from "react-native";
import { Box, Icon, Text, Button, Header } from "react-native-magnus";
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
  const [modal, setModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);

  const { setForm, form, clear } = useForm({
    initialValues: { message: "" },
    validations: {},
  });

  const avatar = require('../resources/magician.png')


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
        user: { _id: 2, name: "Arcano", avatar: avatar },
      };

      // Filtrar las imágenes según las cartas seleccionadas
      const filteredImages = images.filter((image) =>
        selectedCardNames.includes(image.name)
      );

      console.log(messages.length);


      if (filteredImages.length > 0 && messages.length === 2) {
        setSelectedImages(filteredImages);
        setModal(true); // Abrir el modal
      }

      // Agregar la respuesta de IA al chat
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [responseMessage]));
      setLoading(false);
    },
    [messages, form, clear]
  );

  const fetchMessages = async () => {
    setMessages([
      {
        _id: 1,
        text: "Bienvenido al espacio de reflexión, por favor formula tu pregunta para poder ayudarte.",
        createdAt: new Date(),
        user: { _id: 2, name: "Arcano", avatar: avatar },
      },
      {
        _id: 0,
        text: "Sabio y Cálido. Maestro Arcano combina conocimiento ancestral y humor en cada lectura.",
        createdAt: new Date(),
        user: { _id: 2, name: "Arcano" },
        system: true, // Estilo de mensaje especial
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
        <Icon name="send" fontFamily="Ionicons" fontSize={22} color="#591970" />
      </Button>
    );
  };

  const renderSystemMessage = (props) => (
    <Box w={"100%"} alignItems="center" mt={'8%'}>
      <Box bg="#1f1f1f" w={"70%"} p={10} borderRadius={10} mb={20}>
        <Box flexDir="row" alignItems="center" justifyContent="center" mb={5}>
          <Text color="green" mr={5}>●</Text>
          <Text color="white">Maestro Arcano</Text>
        </Box>
        <Text color="white" textAlign="center">Sabio y Calido. Maestro Arcano combina conocimiento ancestral y humor en cada lectura.</Text>
      </Box>
    </Box>
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#591970",
            borderRadius: 15
          },
          left: {
            backgroundColor: "#5a338c",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 15,
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

  const handleCoin =  () => {
    Alert.alert('Coins')
  }

  return (
    <SafeAreaView>
      {/* <KeyboardAvoidingView
        behavior="padding" // Ajusta el comportamiento al aparecer el teclado
        style={{ flex: 1 }}
        keyboardVerticalOffset={90} // Ajusta el desplazamiento en iOS
      ></KeyboardAvoidingView> */}
      <View style={styles.header}>
          <Text style={styles.headerText}>Arcano</Text>
          <View style={styles.headerSection}>
            <Text style={styles.coinText}>5</Text>
            <Pressable onPress={handleCoin}>
              <Image source={require('../resources/twemoji_coin.png')} />
            </Pressable>
          </View>
      </View>
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
          opacity={0.1}
          zIndex={-1}
        />

        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderSystemMessage={renderSystemMessage}
          alwaysShowSend={true}
          placeholder="Haz tu pregunta"
          containerStyle={{ marginBottom: 0 }}
          textInputStyle={{
            color: "#000",
            backgroundColor: "#e6e6e6",
            borderRadius: 8,
            paddingHorizontal: 15,
          }}
          textInputProps={{
            selectionColor: "#591970", // Color del cursor
          }}
          listViewProps={{
            contentContainerStyle: {flexGrow: 1 ,justifyContent: "flex-end" },
          }}
        />

        {/* Modal para mostrar las imágenes */}
        <Modal
          visible={modal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModal(false)}
        >

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Animated.Image
                zIndex={-1}
                source={require("../resources/stars.webp")}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  backgroundColor: "#191970",
                }}
              />
              <Text style={styles.modalTitle}>Estas son tus cartas</Text>
              <ScrollView>
                <View style={styles.cardContainer}>
                  {selectedImages.map((image, index) => (
                    <Image
                      key={index}
                      source={image.source}
                      style={styles.cardImage}
                    />
                  ))}
                </View>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <Button
                  mt="md"
                  bg="#fed700"
                  color="#000"
                  onPress={() => setModal(false)}
                >
                  Quiero saber más
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    bottom: 15,
    width: "100%",
  },
  header:{
    backgroundColor: '#191970',
    height: '6%',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  headerText: {
    color: '#d9cab8',
    fontSize: 22,
    fontWeight: 'bold'
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20
  },
  coinText: {
    color: '#d9cab8',
    fontSize: 22,
    marginRight: 10,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#191970",
    paddingVertical: 20,
    width: '100%',
    height: '100%',
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  cardImage: {
    width: 125,
    height: 250,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 10,
    resizeMode: "cover",
  },
});

export default ChatIA;
