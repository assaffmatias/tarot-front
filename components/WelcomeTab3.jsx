import React from "react";
import { Box, Button, Image, Text } from "react-native-magnus";
import ThreeDots from "./ThreeDots";
import { Dimensions } from "react-native";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const { width } = Dimensions.get("screen");

const WelcomeTab3 = ({ setTab, tab = 3, navigation }) => (
  <>
    <Text
      my={"xl"}
      fontSize="5xl"
      textAlign="center"
      fontWeight="500"
      color="white"
      fontFamily="Bold"
    >
      Tu guía espiritual a{"\n"}
      un paso
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
      fontFamily="Medium"
      textAlign="center"
      fontSize={"xl"}
      color="white"
    >
      Accede a respuestas rápidas y precisas{"\n"}
      con la tecnología mas avanzada en{"\n"}
      lecturas de tarot generado por IA.
    </Text>

    <Box my={"sm"} />
    <ThreeDots tab={tab} />
    <Box my={"xl"} />
    <Button
      onPress={() => {
        navigation.navigate(stackRoutesNames.LOGIN);
        setTab(1);
      }}
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

export default WelcomeTab3;
