import React from "react";
import { Box, Button, Image, Text } from "react-native-magnus";
import ThreeDots from "./ThreeDots";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

const WelcomeTab1 = ({ setTab, tab = 1 }) => (
  <>
    <Text
      my={"xl"}
      fontSize="6xl"
      textAlign="center"
      fontWeight="500"
      fontFamily="Bold"
      color="white"
    >
      ¡Bienvenido a{"\n"}
      Arcano!
    </Text>
    <Box
      justifyContent="center"
      alignItems="center"
      position="relative"
      h={350}
      opacity={0.1}
    >
      <Image
        zIndex={1}
        source={require("../resources/logo-arcano.png")}
        h={width * 0.8}
        w={width * 0.8}
      />
    </Box>
    <Text
      my={"sm"}
      textAlign="center"
      fontFamily="Medium"
      fontSize={"xl"}
      color="white"
    >
      Contamos con múltiples expertos y servicios{"\n"}
      de manera económica y segura.
    </Text>

    <Box my={"sm"} />
    <ThreeDots tab={tab} />
    <Box my={"xl"} />
    <Button
      onPress={() => setTab((prev) => prev + 1)}
      shadow="xl"
      fontSize={"3xl"}
      shadowColor="primary"
      bg="primary"
      color="#000"
      fontWeight="bold"
      h={63}
      w={"80%"}
      alignSelf="center"
      rounded={35}
    >
      Siguiente
    </Button>
  </>
);

export default WelcomeTab1;
