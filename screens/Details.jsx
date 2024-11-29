import React, { useState } from "react";
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

  const { data: reviews, loading } = useFetch({
    fetch: true,
    url: `/reviews/${data._id}`,
  });

  const [minutes, setMinutes] = useState(15);
  const [price, setPrice] = useState(data.price * minutes);
  const [newPrice, setNewPrice] = useState(data.price);
  const isSelfProfile = user?._id === data.user._id;

  const handleSelect = (selectedMinutes) => {
    setMinutes(selectedMinutes);
    const newCalculatedPrice = selectedMinutes * data.price;
    setPrice(newCalculatedPrice);
  };

  const handleSavePrice = async () => {
    try {
      await api.PUT(`/services/update/${data._id}`, { price: newPrice });
      alert("Precio actualizado con éxito");
    } catch (error) {
      alert("Error al actualizar el precio");
    }
  };

  return (
    <>
      <HeaderDetails />
      <ScrollDiv showsVerticalScrollIndicator={false} h={"100%"} w={"100%"}>
        <Image
          rounded={25}
          // source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
          source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-wizard-holds-the-fire-as-he-walks-through-the-forest-image_2924861.jpg' }}
          w={"95%"}
          alignSelf="center"
          h={300}
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
            // Si es el tarotista viendo su propio perfil, muestra el input para editar el precio
            <Box>
              <Text fontFamily="Regular" fontSize={"xl"} color="gray-dark" mt="lg" mb={'lg'}>
                Editar precio del servicio:
              </Text>
              <Input
                value={newPrice.toString()}
                onChangeText={setNewPrice}
                keyboardType="numeric"
                placeholder="Introduce el nuevo precio"
              />
            </Box>
          ) : (
            // Si es otro usuario, muestra el selector de minutos y el precio calculado
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
          )}
        </Box>

        {
          isSelfProfile ? (
            <Button
              onPress={handleSavePrice}
              rounded={10}
              bg="primary"
              color="#000"
              fontFamily="Bold"
              px={"2xl"}
              alignSelf="center"
              my={"lg"}
            >
              <Text color="#000">Guardar cambios</Text>
            </Button>
          ) :
            (
              <Box flexDir="row" justifyContent="center">
                <Button
                  onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, quantity:minutes, type: "hire",through: "paypal"})}
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
                <Button
                  onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, quantity:minutes, type: "hire",through: "stripe" })}
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
              </Box>
            )
        }

      </ScrollDiv>

    </>
  );
};

export default Details;
