import React from "react";
import { Box, Button, Icon, Image, Skeleton, Text } from "react-native-magnus";
import { InfinityScroll, Filter } from "../components";
import { useFetch } from "../hooks";
import { ActivityIndicator, Pressable } from "react-native";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Home = () => {
  const { data: last_adquires = [], loading } = useFetch({
    fetch: true,
    url: "/services/last_adquires",
  });

  return (
    <Box flex={1} w={"90%"} alignSelf="center">
      <Text
        fontFamily="Bold"
        fontSize={"4xl"}
        mt={"2xl"}
        color="#191970"
        textAlign="center"
      >
        ARCANO
      </Text>

      <Box flexDir="row" justifyContent="space-between">
        <Button
          bg="transparent"
          onPress={() =>
            navigate(stackRoutesNames.CHAT_SERVICE, {
              _id: "66ee08c0ded49463f9bd6ba5",
            })
          }
        >
          <Icon
            fontFamily="Ionicons"
            name="notifications"
            fontSize={25}
            color="pink"
          />
        </Button>

        <Button
          bg="transparent"
          onPress={() =>
            navigate(stackRoutesNames.CHAT_LIST, {
              _id: "66ee08c0ded49463f9bd6ba5",
            })
          }
        >
          <Icon
            fontFamily="Ionicons"
            name="chatbubbles-sharp"
            fontSize={25}
            color="#191970"
          />
        </Button>
      </Box>

      <Filter />

      <Box
        mt={"lg"}
        w={"93%"}
        flexDir="column"
        alignSelf="center"
        justifyContent="center"
      >
        {!loading && last_adquires[0] && (
          <Text fontSize={"md"} fontFamily="Medium" color="gray">
            Últimas contrataciones
          </Text>
        )}

        <Box flexDir="row">
          {loading && <ActivityIndicator size={"small"} color={"#000"} />}
          {Array.isArray(last_adquires) && last_adquires.map((data, i) => (
            <Pressable
              key={data._id + i}
              onPress={() => navigate(stackRoutesNames.DETAILS, { data })}
            >
              <Image
                rounded={50}
                resizeMode="contained"
                mr={"lg"}
                my={"lg"}
                key={data._id}
                source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
                w={45}
                h={45}
                loadingIndicatorSource={<Skeleton.Circle h={45} w={45} />}
              />
            </Pressable>
          ))}
        </Box>
        <Text fontFamily="Bold" mb={15} fontSize={"lg"}>
          ¡Encuentra los mejores tarotistas!
        </Text>
      </Box>

      <InfinityScroll />
    </Box>
  );
};

export default Home;
