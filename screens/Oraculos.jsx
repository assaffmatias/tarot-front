import React, { useState, useEffect } from "react";
import { Alert, Animated, Pressable, Image, Text } from "react-native";
import { Box, ScrollDiv, Button } from "react-native-magnus";
import { Dimensions } from "react-native";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Oraculos = () => {
  const magician = require("../resources/magician.png")
  const navigation = useNavigation()

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


  const [selectedCards, setSelectedCards] = useState([]);

  const toggleCardSelection = (card) => {
    // Si la carta ya está seleccionada, se elimina de la lista
    if (selectedCards.some(selected => selected.name === card.name)) {
      setSelectedCards(selectedCards.filter(selected => selected.name !== card.name));
    } else {
      // Si no está seleccionada y no supera el límite, se agrega
      if (selectedCards.length <= 4) {
        setSelectedCards([...selectedCards, card]);
      } else {
        Alert.alert("Límite alcanzado", "Solo puedes seleccionar hasta 5 cartas.");
      }
    }
  };

  const isSelected = (card) => selectedCards.some(selected => selected.name === card.name);

  const handleNextPress = () => {
    // Verificar si la cantidad de cartas seleccionadas es 1, 3 o 5
    if (selectedCards.length === 1 || selectedCards.length === 3 || selectedCards.length === 5) {
      // Pasar la cantidad de cartas y los nombres de las cartas seleccionadas al siguiente componente
      const selectedCardNames = selectedCards.map(card => card.name); // Extraer solo los nombres de las cartas seleccionadas
      navigation.navigate(stackRoutesNames.CHAT_IA, {
        selectedCardCount: selectedCards.length,
        selectedCardNames: selectedCardNames
      });
    } else {
      Alert.alert("Selección inválida", "Debes seleccionar 1, 3 o 5 cartas.");
    }
  };

  return (
    <>
      <Animated.Image
        zIndex={-1}
        source={require("../resources/stars.webp")}
        style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "#191970" }}
      />
      <ScrollDiv w={"100%"} h={"100%"}>
        <Box justifyContent="center" alignItems="center" alignSelf="center" mt={50}>
          <Image source={magician} style={{ width: width * 0.8, height: width * 0.8, resizeMode: "contain" }} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>Elige la cantidad de</Text>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>Cartas para tu tirada</Text>
          <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" padding="lg" pl={10} pr={10} mt={40} mb={40}>
            {images.map((img, index) => (
             <Box key={index} alignItems="center" marginBottom="lg">
                <Pressable onPress={() => toggleCardSelection(img)}>
                  <Image 
                  source={img.source} 
                  style={{
                    width: width * 0.3, 
                    height: height * 0.3, 
                    marginBottom: 20,
                    opacity: isSelected(img) ? 1 : 0.5,
                    borderWidth: isSelected(img) ? 1 : 0,
                    borderColor: "white",
                    borderRadius: 10
                    
                    }}/>
                </Pressable>
              </Box>
            ))}
          </Box>
          <Button
            shadow="xl"
            fontSize={"3xl"}
            shadowColor="primary"
            bg="primary"
            color="#000"
            fontWeight="bold"
            h={63}
            // w={"80%"}
            pl={'20%'}
            pr={'20%'}
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
