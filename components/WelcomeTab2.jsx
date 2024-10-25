import React from "react";
import { Box, Button, Image, Text } from "react-native-magnus";
import ThreeDots from "./ThreeDots";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

const WelcomeTab2 = ({ setTab, tab = 2 }) => (
  <>
    <Text
      my={"xl"}
      fontSize="5xl"
      textAlign="center"
      fontWeight="500"
      color="white"
      fontFamily="Bold"
    >
      Descubre tu{"\n"}
      destino
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
      fontFamily="Medium"
      my={"sm"}
      textAlign="center"
      fontSize={"xl"}
      color="white"
    >
      Consulta con tarotistas de confianza{"\n"}
      al alcance de un clic.
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

export default WelcomeTab2;
