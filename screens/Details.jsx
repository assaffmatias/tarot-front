import React, { useState, useRef } from "react";
import { HeaderDetails, Review } from "../components";
import { Box, Button, Image, ScrollDiv, Tag, Text } from "react-native-magnus";
import { useRoute } from "@react-navigation/native";
import { useFetch } from "../hooks";
import { ActivityIndicator } from "react-native";
import NewComment from "../components/NewComment";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import CustomSelect from "../components/CustomSelect"; // Importa el CustomSelect

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Details = ({}) => {
  const route = useRoute();
  const { data = {} } = route.params;

  const { data: reviews, loading } = useFetch({
    fetch: true,
    url: `/reviews/${data._id}`,
  });

  const [minutes, setMinutes] = useState(1);
  const [price, setPrice] = useState(data.price);

  // Opciones para el selector
  const options = [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60];

  const handleSelect = (selectedMinutes) => {
    setMinutes(selectedMinutes);
    const newPrice = selectedMinutes * data.price;
    setPrice(newPrice);
  };

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
      </ScrollDiv>

      {/* Selector de minutos */}
      <Box w={"90%"} alignSelf="center" my="lg">
        <CustomSelect
          title="Selecciona los minutos"
          placeholder="Selecciona"
          options={options} // Pasa las opciones
          setForm={(name, value) => handleSelect(value)} // Actualiza el estado al seleccionar
          form={{ lorem: minutes }} // Puedes usar esto para manejar el estado del formulario
          selected={minutes} // Valor seleccionado
          name="minutes" // Nombre del campo
        />
        
        <Text fontFamily="Regular" fontSize={"xl"} color="gray-dark" mt="lg">
          Precio total: ${price}
        </Text>
      </Box>

      {/* Botón para contratar */}
      <Button
        onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, through: "paypal" })}
        rounded={10}
        bg="primary"
        color="#000"
        fontFamily="Bold"
        px={"2xl"}
        alignSelf="center"
        my={"lg"}
      >
        <Text color="#000">¡Contratar Paypal!</Text>
      </Button>
      <Button
        onPress={() => navigate(stackRoutesNames.PAY_SERVICE, { data, price, through: "stripe" })}
        rounded={10}
        bg="primary"
        color="#000"
        fontFamily="Bold"
        px={"2xl"}
        alignSelf="center"
        my={"lg"}
      >
        <Text color="#000">¡Contratar 3rd party!</Text>
      </Button>
    </>
  );
};

export default Details;
