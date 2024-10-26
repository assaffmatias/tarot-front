import React from "react";
import { Box, Icon, Image, Text } from "react-native-magnus";
import { Pressable, StyleSheet } from "react-native";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const CardComponent = ({ data }) => {
  return (
    <Pressable onPress={() => navigate(stackRoutesNames.DETAILS, { data })}>
      <Box
        w={"100%"}
        h={429}
        maxW={397}
        rounded={15}
        bg="#303030"
        overflow="hidden"
      >
        <Image
          position="absolute"
          P
          h={429}
          maxW={397}
          w={"100%"}
          source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
        />

        <Box style={style.blurView} intensity={11}>
          <Text color="#fff" fontSize={"3xl"} fontFamily="Bold">
            ${data.price}/m
          </Text>
        </Box>

        <Box zIndex={1} position="absolute" bottom={"5%"} left={"5%"}>
          <Text my={"xs"} color="#fff" fontFamily="Bold" fontSize={"6xl"}>
            {data?.user?.userName ?? "Error"}
          </Text>
          <Text my={"xs"} color="#fff" fontFamily="Bold" fontSize={"3xl"}>
            Vidente <Box w={12} h={12} bg="green600" rounded={50} />
          </Text>
          <Text
            my={"xs"}
            color="#fff"
            fontSize={"xl"}
            maxW={"95%"}
            fontFamily="Medium"
          >
            {data.description}
          </Text>
          <Box my={"xs"} alignItems="center" flexDir="row">
            <Text color="#fff" fontFamily="Bold" fontSize={"3xl"} mr={10}>
              4.7
            </Text>
            <Icon
              fontFamily="AntDesign"
              name="star"
              fontSize={25}
              color="primary"
            />
          </Box>
        </Box>

        <Icon
          fontFamily="Foundation"
          position="absolute"
          right={"5%"}
          bottom={"5%"}
          name="info"
          color="#fff"
          fontSize={30}
        />
      </Box>
    </Pressable>
  );
};

const style = StyleSheet.create({
  blurView: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "5%",
    right: "5%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 70,
    height: 70,
  },
});

export default CardComponent;
