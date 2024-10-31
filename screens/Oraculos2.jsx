import React, { useState } from "react";
import { Alert, Animated, Pressable } from "react-native";
import { Box, ScrollDiv, Text } from "react-native-magnus";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Oraculos2 = () => {
  const [inProcess, setInProcess] = useState(false);

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

  // Crear un array para las animaciones de vibración (movimiento horizontal)
  const animations = images.map(() => useState(new Animated.Value(0))[0]);

  const handlePress = (index) => {
    if (inProcess) return;
    setInProcess(true);

    const vibrationAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 5, // Mueve 5px hacia la derecha
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: -5, // Mueve 5px hacia la izquierda
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    // Iniciar la animación de vibración
    vibrationAnimation.start();

    // Detener la vibración después de 1 segundo
    setTimeout(() => {
      vibrationAnimation.stop();
      Animated.timing(animations[index], {
        toValue: 0,
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
        source={require("../resources/stars.webp")}
        style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "#191970" }}
      />
      <Text fontFamily="Bold" fontSize={"4xl"} textAlign="center" color="#fff" pt={30}>
        ARCANO
      </Text>
      <ScrollDiv w={"100%"} h={"100%"}>
        <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" padding="lg">
          {images.map((img, index) => (
            <Box key={index} alignItems="center" marginBottom="lg">
              <Pressable onPress={() => handlePress(index)}>
                <Animated.Image
                  source={img}
                  style={{
                    width: width * 0.3,
                    height: height * 0.24,
                    transform: [{ translateX: animations[index] }],
                  }}
                  resizeMode="contain"
                />
              </Pressable>
              <Text color="white" fontSize="2xl" textAlign="center" fontWeight="bold">
                {months[index]}
              </Text>
            </Box>
          ))}
        </Box>
      </ScrollDiv>
    </>
  );
};

export default Oraculos2;
