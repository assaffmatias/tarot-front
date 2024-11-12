import React, { useState } from "react";
import { Animated, Image, Text, Alert } from "react-native";
import { Box, ScrollDiv, Button } from "react-native-magnus";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const { width, height } = Dimensions.get("window");

const Oraculos = () => {
  const magician = require("../resources/magician.png");
  const navigation = useNavigation();

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

  const [selectedCardCount, setSelectedCardCount] = useState(0);

  const handleCardSelection = (count) => {
    setSelectedCardCount(count);
  };

  const handleNextPress = () => {
    if (selectedCardCount === 0) {
      Alert.alert("Selecciona una cantidad", "Por favor selecciona 1, 3 o 5 cartas.");
      return;
    }

    const shuffledCards = images
      .map((card) => ({ ...card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .slice(0, selectedCardCount)
      .map((card) => card.name);

    navigation.navigate(stackRoutesNames.CHAT_IA, {
      selectedCardCount,
      selectedCardNames: shuffledCards,
    });
  };

  return (
    <>
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
      <ScrollDiv w={"100%"} h={"100%"}>
        <Box justifyContent="center" alignItems="center" alignSelf="center" mt={50}>
          <Image
            source={magician}
            style={{
              width: width * 0.8,
              height: width * 0.8,
              resizeMode: "contain",
            }}
          />
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
            Elige la cantidad de
          </Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
            Cartas para tu tirada
          </Text>
          <Box flexDirection="row" justifyContent="space-around" mt={40} mb={40} w="80%">
            <Button
              shadow="xl"
              fontSize={"xl"}
              shadowColor={selectedCardCount === 1 ? "secondary" : "primary"}
              bg={selectedCardCount === 1 ? "secondary" : "primary"}
              color="#000"
              fontWeight="bold"
              h={50}
              w={100}
              rounded={10}
              onPress={() => handleCardSelection(1)}
            >
              1 Carta
            </Button>
            <Button
              shadow="xl"
              fontSize={"xl"}
              shadowColor={selectedCardCount === 3 ? "secondary" : "primary"}
              bg={selectedCardCount === 3 ? "secondary" : "primary"}
              color="#000"
              fontWeight="bold"
              h={50}
              w={100}
              rounded={10}
              onPress={() => handleCardSelection(3)}
            >
              3 Cartas
            </Button>
            <Button
              shadow="xl"
              fontSize={"xl"}
              shadowColor={selectedCardCount === 5 ? "secondary" : "primary"}
              bg={selectedCardCount === 5 ? "secondary" : "primary"}
              color="#000"
              fontWeight="bold"
              h={50}
              w={100}
              rounded={10}
              onPress={() => handleCardSelection(5)}
            >
              5 Cartas
            </Button>
          </Box>
          <Button
            shadow="xl"
            fontSize={"3xl"}
            shadowColor="primary"
            bg="primary"
            color="#000"
            fontWeight="bold"
            h={63}
            pl={"20%"}
            pr={"20%"}
            alignSelf="center"
            rounded={35}
            mb={40}
            onPress={handleNextPress}
          >
            Siguiente
          </Button>
        </Box>
      </ScrollDiv>
    </>
  );
};

export default Oraculos;
