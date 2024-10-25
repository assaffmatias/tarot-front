import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Icon, Modal, Text } from "react-native-magnus";
import { useFetch, useForm } from "../hooks";
import { useRoute } from "@react-navigation/native";
import Review from "./Review";
import { FlatList } from "react-native";
import FormComment from "./FormComment";

const NewComment = () => {
  const [visible, setVisible] = useState(false);

  const route = useRoute();

  const { data = {} } = route.params;

  const { form, setForm, clear, ready } = useForm({
    initialValues: { rate: 1, message: "" },
    validations: {},
  });

  const { data: reviews, loading } = useFetch({
    fetch: visible,
    url: `/reviews/${data._id}?test=true`,
  });

  const handleClose = useCallback(() => {
    setVisible(false);
    clear();
  }, [setVisible, clear]);

  return (
    <>
      {!loading && (
        <Button
          alignSelf="center"
          rounded={10}
          fontFamily="Bold"
          onPress={() => setVisible(true)}
        >
          Ver más
        </Button>
      )}

      <Modal avoidKeyboard h={"100%"} isVisible={visible} py={15} px={15}>
        <Button
          bg="gray400"
          h={35}
          w={35}
          alignSelf="flex-end"
          rounded="circle"
          onPress={handleClose}
        >
          <Icon color="black900" name="close" />
        </Button>

        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Review data={item} />}
          ListEmptyComponent={
            !loading ? (
              <Text fontFamily="Bold" fontSize={"2xl"}>
                No hay reviews
              </Text>
            ) : (
              <ActivityIndicator size={"small"} color={"#000"} />
            )
          }
        />

        <FormComment
          form={form}
          handleClose={handleClose}
          ready={ready}
          setForm={setForm}
        />
      </Modal>
    </>
  );
};

export default NewComment;
