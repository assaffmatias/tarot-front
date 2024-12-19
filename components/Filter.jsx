import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Icon,
  Image,
  Input,
  Text,
} from "react-native-magnus";
import { Pressable, Modal, FlatList, View, TouchableOpacity } from "react-native";
import { useDebounce, useFetch, useForm } from "../hooks";
import { useFilterStore } from "../stores";

const Filter = () => {
  const { form, setForm } = useForm({
    initialValues: { tags: [], search: "", page: 1 },
  });

  const debounceValue = useDebounce(form.search, 1200);
  const setFilters = useFilterStore((state) => state.setHomeFilter);

  useEffect(() => {
    setFilters(form); // Actualizamos los filtros en zustand
  }, [debounceValue, form.tags]); // Escuchamos los cambios en los filtros

  const { data } = useFetch({
    url: "/tags/list",
    fetch: true,
    withFilters: false,
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const handleSelect = (selectedItemId) => {
    const isSelected = form.tags.includes(selectedItemId);
    const updatedTags = isSelected
      ? form.tags.filter((tag) => tag !== selectedItemId)
      : [...form.tags, selectedItemId];
    setForm("tags", updatedTags);
  };

  return (
    <Box w="100%" flexDir="column" alignSelf="center" justifyContent="center">
      {/* Search Bar */}
      <Box
        w="80%"
        alignSelf="center"
        flexDir="row"
        justifyContent="center"
        alignItems="center"
        mb="lg"
      >
        <Input
          onChangeText={(value) => setForm("search", value)}
          w="100%"
          h={41}
          p={0}
          fontFamily="Regular"
          placeholder="Buscar especialista..."
        />
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            ml={15}
            source={require("../resources/filter_icon.png")}
            w={35}
            h={35}
          />
        </Pressable>
      </Box>

      {/* Modal for Select Menu */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}  // Cierra el modal si se hace clic fuera de su contenido
        >
          <TouchableOpacity activeOpacity={1} style={{ marginTop: "auto" }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  const isSelected = form.tags.includes(item._id);
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelect(item._id)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isSelected ? "#f6e05e" : "#f9f9f9",
                        borderRadius: 5,
                        marginVertical: 5
                      }}
                    >
                      <Text style={{ color: isSelected ? "black" : "black" }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <Button
                onPress={() => setModalVisible(false)}
                rounded={5}
                bg="#191970"
                fontFamily="Bold"
                color="#fff"
                w="100%"
                mt="lg"
              >
                Aplicar Filtros
              </Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Box>
  );
};

export default Filter;
