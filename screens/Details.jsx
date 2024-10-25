import React from "react";
import { HeaderDetails, Review } from "../components";
import { Box, Button, Image, ScrollDiv, Tag, Text } from "react-native-magnus";
import { useRoute } from "@react-navigation/native";
import { useFetch } from "../hooks";
import { ActivityIndicator } from "react-native";
import NewComment from "../components/NewComment";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Details = ({}) => {
  const route = useRoute();

  const { data = {} } = route.params;

  const { data: reviews, loading } = useFetch({
    fetch: true,
    url: `/reviews/${data._id}`,
  });

  return (
    <>
      <HeaderDetails />
      <ScrollDiv showsVerticalScrollIndicator={false} h={"100%"} w={"100%"}>
        <Image
          rounded={25}
          source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
          w={"95%"}
          alignSelf="center"
          h={300}
        />
        <Box
          my={"lg"}
          alignItems="center"
          flexDir="row"
          flexWrap="wrap"
          w={"95%"}
          alignSelf="center"
        >
          {data?.tags?.map((t, key) => (
            <Tag
              m={"sm"}
              key={key}
              bg="yellow400"
              color="gray-dark"
              fontFamily="Medium"
            >
              {t.name}
            </Tag>
          ))}
        </Box>

        <Box w={"90%"} h={1} bg="primary" my={"xl"} alignSelf="center" />

        <Box w={"90%"} alignSelf="center">
          <Text fontFamily="Heavy" fontSize={"xl"} color="gray-dark">
            Sobre mi
          </Text>
          <Text fontFamily="Regular" fontSize={"xl"} color="gray">
            {data?.description}
          </Text>
        </Box>

        <Box w={"90%"} h={1} bg="primary" my={"xl"} alignSelf="center" />

        <Box w={"90%"} alignSelf="center">
          <Text fontFamily="Heavy" fontSize={"xl"} color="gray-dark">
            Comentarios
          </Text>

          <Box mt={"xl"}>
            {!reviews[0] && !loading && (
              <Text fontFamily="Regular" fontSize={"xl"} color="gray">
                No hay comentarios
              </Text>
            )}

            {reviews?.map((review) => (
              <Review key={review._id} data={review} />
            ))}
            {loading && <ActivityIndicator size={25} color={"#000"} />}
          </Box>
        </Box>
        <NewComment />
      </ScrollDiv>
      <Button
        onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data })}
        rounded={10}
        bg="primary"
        color="#000"
        fontFamily="Bold"
        px={"2xl"}
        alignSelf="center"
        my={"lg"}
      >
        ¡Contratar!
      </Button>
    </>
  );
};

export default Details;
