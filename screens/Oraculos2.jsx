import React, { useState, useEffect } from "react";
import { Alert, Animated, Pressable } from "react-native";
import { Box, ScrollDiv, Text } from "react-native-magnus";
import { Dimensions } from "react-native";
import { api } from "../axios"

const { width, height } = Dimensions.get("window");

const Oraculos2 = () => {
  const [inProcess, setInProcess] = useState(false);
  const [cards, setCards] = useState([]);

  // Array de las imágenes
  const images = [
    require("../resources/1.png"),
    require("../resources/2.png"),
    require("../resources/3.png"),
    require("../resources/4-2.png"),
    require("../resources/5.png"),
    require("../resources/6.png"),
    require("../resources/7.png"),
    require("../resources/8.png"),
    require("../resources/9.png"),
    require("../resources/10.png"),
    require("../resources/11.png"),
    require("../resources/12.png"),
  ];

  // Nombres de los meses desde marzo
  const months = [
    "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre", "Enero", "Febrero"
  ];

  useEffect(() => {
    // Obtén las cartas de la API
    const fetchCards = async () => {
      const data = await api.GET("/card"); // Ajusta la ruta si es necesario
      setCards(data); // Suponiendo que la respuesta es un array de cartas
    };

    fetchCards();
  }, [])

  console.log(cards);


  // const handlePress = (index) => {
  //   Alert.alert("Aqui se abre el modal con el horoscopo");
  // };

  // Manejador de presionado, muestra el texto asociado con la carta
  const handlePress = (month) => {
    const id = month.charAt(0).toLowerCase() + month.slice(1); // Convertir la primera letra a minúscula
    const card = cards.find(c => c.id === id); // Busca la carta por su id
    if (card) {
      Alert.alert("Horóscopo", card.text); // Muestra el texto en el alert
    } else {
      Alert.alert("Sin datos", "No se encontró una carta para este mes.");
    }

    // const card = cards.find(c => c.id === id); // Busca la carta por su id
    // if (card) {
    //   Alert.alert("Horóscopo", card.text); // Muestra el texto en el alert
    // }
  };

  return (
    <>
      <Animated.Image
        zIndex={-1}
        source={require("../resources/stars.webp")}
        style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "#191970" }}
      />
      <Text fontFamily="Bold" fontSize={"4xl"} textAlign="center" color="#fff" pt={30}>
        ARCANO
      </Text>
      <ScrollDiv w={"100%"} h={"100%"}>
        <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" ml={10} mr={10}>
          {images.map((img, index) => (
            <Box key={index}>
              <Pressable onPress={() => handlePress(months[index])}>
                <Animated.Image
                  source={img}
                  style={{
                    width: width * 0.3,
                    height: height * 0.2,
                  }}
                  resizeMode="contain"
                />
              </Pressable>
              {/* <Animated.Text
                style={{
                  color: "white",
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {months[index]}
              </Animated.Text> */}
            </Box>
          ))}
        </Box>
      </ScrollDiv>
    </>
  );
};

export default Oraculos2;
