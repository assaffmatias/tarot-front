import React, { useState, useEffect } from "react";
import { HeaderDetails, Review } from "../components";
import { Box, Button, Image, ScrollDiv, Tag, Text, Input } from "react-native-magnus";
import { useRoute } from "@react-navigation/native";
import { useFetch } from "../hooks";
import { ActivityIndicator } from "react-native";
import NewComment from "../components/NewComment";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import CustomSelect from "../components/CustomSelect"; // Importa el CustomSelect
import { useAuthStore } from "../stores";
import axios from "axios";
import { api } from "../axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Progreso: ${percentCompleted}%`);
  },
};

const Details = ({ }) => {
  const route = useRoute();
  const { data = {} } = route.params;
  const user = useAuthStore((state) => state.userInfo);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [stripeAlias, setStripeAlias] = useState("");

  const { data: reviews, loading } = useFetch({
    fetch: true,
    url: `/reviews/${data._id}`,
  });

  const [minutes, setMinutes] = useState(15);
  const [price, setPrice] = useState(data.price * minutes);
  const isSelfProfile = user?._id === data.user._id;

  const handleSelect = (selectedMinutes) => {
    setMinutes(selectedMinutes);
    const newCalculatedPrice = selectedMinutes * data.price;
    setPrice(newCalculatedPrice);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.GET(`/user/${data.user._id}`);
        const { paypal_email, stripe_alias } = response.user;

        console.log('RESPONSSE:', response.user);


        if (paypal_email) {
          setPaypalEmail(paypal_email);
        }
        if (stripe_alias) {
          setStripeAlias(stripe_alias);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Hubo un problema al cargar los datos del usuario.");
      }
    };
    fetchData();
  }, [user._id]);

  return (
    <>
      {/* <HeaderDetails /> */}
      <ScrollDiv showsVerticalScrollIndicator={false} h={"100%"} w={"100%"}>
        <Image
          rounded={25}
          // source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
          source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-wizard-holds-the-fire-as-he-walks-through-the-forest-image_2924861.jpg' }}
          w={"95%"}
          alignSelf="center"
          h={300}
          mt={20}
        />
        <Box my={"lg"} alignItems="center" flexDir="row" flexWrap="wrap" w={"95%"} alignSelf="center">
          {data?.tags?.map((t, key) => (
            <Tag m={"sm"} key={key} bg="yellow400" color="gray-dark" fontFamily="Medium">
              {t.name}
            </Tag>
          ))}
        </Box>

        <Box w={"90%"} alignSelf="center">
          <Text fontFamily="Heavy" fontSize={"xl"} color="gray-dark">Sobre mi</Text>
          <Text fontFamily="Regular" fontSize={"xl"} color="gray">{data?.description}</Text>
        </Box>

        <Box w={"90%"} h={1} bg="primary" my={"xl"} alignSelf="center" />

        <Box w={"90%"} alignSelf="center">
          <Text fontFamily="Heavy" fontSize={"xl"} color="gray-dark">Comentarios</Text>
          <Box mt={"xl"}>
            {!reviews[0] && !loading && (
              <Text fontFamily="Regular" fontSize={"xl"} color="gray">No hay comentarios</Text>
            )}
            {reviews?.map((review) => (
              <Review key={review._id} data={review} />
            ))}
            {loading && <ActivityIndicator size={25} color={"#000"} />}
          </Box>
        </Box>

        <NewComment />


        <Box w={"90%"} alignSelf="center" my="lg">
          {isSelfProfile ? (
            // Si es el tarotista viendo su propio perfil, no muestra nada
            null
          ) : (
            // Si es otro usuario
            <>
              {paypalEmail || stripeAlias ? (
                // Si tiene al menos un método de pago, muestra el selector de minutos y el precio
                <>
                  <CustomSelect
                    title="Selecciona los minutos"
                    placeholder="Selecciona"
                    options={[15, 30, 45]}
                    setForm={(name, value) => handleSelect(value)}
                    form={{ lorem: minutes }}
                    selected={minutes}
                    name="minutes"
                  />
                  <Text fontFamily="Regular" fontSize={"xl"} color="gray-dark" mt="lg">
                    Precio total: ${price}
                  </Text>
                </>
              ) : (
                // Si no tiene ningún método de pago configurado, muestra un mensaje
                <Text fontFamily="Regular" fontSize={"xl"} color="gray-dark" mt="lg" textAlign="center">
                  Este usuario no acepta medios de pago.
                </Text>
              )}
            </>
          )}
        </Box>

        {
          isSelfProfile ? (
            null
          ) :
            (
              <Box flexDir="row" justifyContent="center">
                {paypalEmail && (
                  <Button
                    onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, quantity: minutes, type: "hire", through: "paypal" })}
                    rounded={10}
                    bg="primary"
                    color="#000"
                    fontFamily="Bold"
                    px={"2xl"}
                    alignSelf="center"
                    my={"lg"}
                    mr={5}
                  >
                    <Text color="#000">Paypal</Text>
                  </Button>
                )}
                {stripeAlias && (
                  <Button
                    onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, quantity: minutes, type: "hire", through: "stripe" })}
                    rounded={10}
                    bg="primary"
                    color="#000"
                    fontFamily="Bold"
                    px={"2xl"}
                    alignSelf="center"
                    my={"lg"}
                    ml={5}
                  >
                    <Text color="#000">Mastercard / Visa</Text>
                  </Button>
                )}
              </Box>
            )
        }

      </ScrollDiv>

    </>
  );
};

export default Details;
