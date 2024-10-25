import React, { useState } from "react";
import { Alert, Animated, Pressable } from "react-native";
import { Box, ScrollDiv, Text } from "react-native-magnus";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Oraculos2 = () => {
  // Crear un array para las animaciones de vibración (movimiento horizontal)

  const [inProcess, setInProcess] = useState(false);

  const animations = [
    require("../resources/11_card.png"),
    require("../resources/12_card.png"),
    require("../resources/13_card.png"),
    require("../resources/21_card.png"),
    require("../resources/22_card.png"),
    require("../resources/23_card.png"),
    require("../resources/31_card.png"),
    require("../resources/32_card.png"),
    require("../resources/33_card.png"),
    require("../resources/41_card.png"),
    require("../resources/42_card.png"),
    require("../resources/43_card.png"),
  ].map(() => useState(new Animated.Value(0))[0]); // Inicializar la animación de vibración en 0 (posición inicial)

  const handlePress = (index) => {
    if (inProcess) return;
    setInProcess(true);
    const vibrationAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 5, // Mueve 5px hacia la derecha
          duration: 100, // Duración del movimiento
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: -5, // Mueve 5px hacia la izquierda
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1, // Se repite indefinidamente hasta que se cancele
      }
    );
    // Iniciar la animación de vibración
    vibrationAnimation.start();

    // Detener la vibración después de 3 segundos
    setTimeout(() => {
      vibrationAnimation.stop();
      Animated.timing(animations[index], {
        toValue: 0, // Volver a la posición original
        duration: 100,
        useNativeDriver: true,
      }).start();
      setInProcess(false);
      Alert.alert("Aqui se abre el modal con el horoscopo");
    }, 1000);
  };

  return (
    <>
      <Animated.Image
        zIndex={-1}
        source={require("../resources/bg_horoscopo.png")}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <Text fontFamily="Bold" fontSize={"4xl"} textAlign="center" color="#fff">
        ARCANO
      </Text>
      <ScrollDiv w={"100%"} h={"100%"}>
        <Box
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          padding="lg"
        >
          {[
            require("../resources/11_card.png"),
            require("../resources/12_card.png"),
            require("../resources/13_card.png"),
            require("../resources/21_card.png"),
            require("../resources/22_card.png"),
            require("../resources/23_card.png"),
            require("../resources/31_card.png"),
            require("../resources/32_card.png"),
            require("../resources/33_card.png"),
            require("../resources/41_card.png"),
            require("../resources/42_card.png"),
            require("../resources/43_card.png"),
          ].map((img, index) => (
            <Pressable
              key={index}
              onPress={() => handlePress(index)} // Ejecutar la vibración al presionar
            >
              <Animated.Image
                source={img}
                style={{
                  width: width * 0.3,
                  height: height * 0.24,
                  // marginHorizontal: 8,
                  transform: [{ translateX: animations[index] }], // Aplicar la animación de movimiento horizontal
                }}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </Box>
      </ScrollDiv>
    </>
  );
};

export default Oraculos2;
