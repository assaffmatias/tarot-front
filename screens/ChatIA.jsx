import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Animated, Image, View, Modal, ScrollView, Pressable, Alert } from "react-native";
import { Box, Icon, Text, Button } from "react-native-magnus";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { handleOraculo } from "../services";
import { useForm } from "../hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores";
import { api } from "../axios";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const ChatIA = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedCardCount, selectedCardNames } = route.params;
  const [modal, setModal] = useState(false)
  const [modalCoins, setModalCoins] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);
  const user = useAuthStore((state) => state.userInfo);
  const [coins, setCoins] = useState(0)
  const [payment, setPayment] = useState('')
  const [selectCoins, setSelectCoins] = useState(0)
  const [price, setPrice] = useState(0)

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

  const handleCoins = async () => {
    const response = await api.GET(`/user/${user._id}`)
    setCoins(response.user.chatCoins)
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    handleCoins();
  }, [messages]);


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
      const { response } = await handleOraculo({ user, form: message, clear, setLoading, lastMessages, selectedCardNames });
      console.log('RESPONSE:', response);

      // if(response === 'Lo siento, no estoy disponible en este momento.' || response === 'Ops! No tienes monedas suficientes') return

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

      if (response !== 'Lo siento, no estoy disponible en este momento.' && response !== 'Ops! No tienes monedas suficientes') {
        console.log('ENTRA AL IF');

        if (filteredImages.length > 0 && messages.length === 2) {
          setSelectedImages(filteredImages);
          setModal(true); // Abrir el modal
        }
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
      <Box bg="#1f1f1f" w={"70%"} p={10} borderRadius={10} mb={20} opacity={0.8}>
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

  const handleModalCoins = () => {
    // Alert.alert('Coins')
    setModalCoins(!modalCoins)
    setPayment('')
    setSelectCoins(0)
  }

  const handlePayment = (props) => {
    setPayment(props)
  }

  const handleQuantity = (props) => {
    setSelectCoins(props)
    //Precios $2.45 -- $4.45 -- $9.95
    props === 5 ? setPrice(2) : props === 10 ? setPrice(4) : setPrice(9)
  }

  const handleContinue = () => {
    if (payment === '') {
      Alert.alert('Debes seleccionar un método de pago')
      return
    }

    if (selectCoins === 0) {
      Alert.alert('Debes seleccionar una cantidad de monedas')
      return
    }
    navigate(stackRoutesNames.PAY_COINS, { price, quantity: selectCoins, through: payment, type: 'coins' })
    setModalCoins(false)
  }

  console.log('payment:', payment);


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
          <Text style={styles.coinText}>{coins}</Text>
          <Pressable onPress={handleModalCoins}>
            <FontAwesome6 name="coins" size={24} color="#e8b442" />
            {/* <Image source={require('../resources/twemoji_coin.png')} /> */}
          </Pressable>
        </View>
      </View>
      <Box w={"100%"} h={"100%"} bg="#191970">
        <Animated.Image
          source={require("../resources/bg_chat2.jpg")}
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
            contentContainerStyle: { flexGrow: 1, justifyContent: "flex-end" },
          }}
        />



        {/* Modal para las coins */}
        <Modal
          visible={modalCoins}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModal(false)}
        >
          <View style={{ backgroundColor: 'white', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: "center", width: '80%' }}>
              <FontAwesome6 name="coins" size={100} color="#e8b442" style={{ marginBottom: 20 }} />
              <Text style={{ fontSize: 20 }}>Selecciona una cantidad</Text>
              <Pressable onPress={() => handleQuantity(5)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20, backgroundColor: selectCoins === 5 ? '#09f' : '#e8b442', padding: 10, borderRadius: 10 }}>
                  <Text style={{ color: selectCoins === 5 ? '#fff' : '#000', }}>5 monedas</Text>
                  <Text style={{ color: selectCoins === 5 ? '#fff' : '#000', }}>$2.45</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => handleQuantity(10)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20, backgroundColor: selectCoins === 10 ? '#09f' : '#e8b442', padding: 10, borderRadius: 10 }}>
                  <Text style={{ color: selectCoins === 10 ? '#fff' : '#000', }}>10 monedas</Text>
                  <Text style={{ color: selectCoins === 10 ? '#fff' : '#000', }}>$4.45</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => handleQuantity(25)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20, backgroundColor: selectCoins === 25 ? '#09f' : '#e8b442', padding: 10, borderRadius: 10 }}>
                  <Text style={{ color: selectCoins === 25 ? '#fff' : '#000', }}>25 monedas</Text>
                  <Text style={{ color: selectCoins === 25 ? '#fff' : '#000', }}>$9.95</Text>
                </View>
              </Pressable>
              <Text style={{ fontSize: 20, marginTop: 20 }}>Como quieres pagar?</Text>
              <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => handlePayment('paypal')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 20,
                      backgroundColor: payment === 'paypal' ? '#09f' : '#e8b442',
                      padding: 10,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                  >
                    <FontAwesome6 name="paypal" size={24} color={payment === 'paypal' ? '#fff' : '#000'} />
                    <Text style={{ color: payment === 'paypal' ? '#fff' : '#000', marginLeft: 10, fontWeight: 'bold' }}>Paypal</Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => handlePayment('visa')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 20,
                      backgroundColor: payment === 'visa' ? '#09f' : '#e8b442',
                      padding: 10,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                  >
                    <FontAwesome6 name="cc-mastercard" size={24} color={payment === 'visa' ? '#fff' : '#000'} />
                    <Text style={{ color: payment === 'visa' ? '#fff' : '#000', marginLeft: 10, fontWeight: 'bold' }}>Mastercard / Visa</Text>
                  </View>
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 40 }}>
                <Pressable onPress={handleModalCoins}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#e8b442', padding: 10, borderRadius: 10, marginRight: 10 }}>
                    <Text>Cancelar</Text>
                  </View>
                </Pressable>
                <Pressable onPress={handleContinue}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, backgroundColor: '#e8b442', padding: 10, borderRadius: 10, marginLeft: 10 }}>
                    <Text>Continuar</Text>
                  </View>
                </Pressable>
              </View>
              {/* <Button style={{width: '50%'}} onPress={handleCoin}>Cerrar</Button> */}
            </View>
          </View>
        </Modal>

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
  header: {
    backgroundColor: '#191970',
    height: '10%',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
