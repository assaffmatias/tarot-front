import React, { useState } from "react";
import { Box, Image, Text, ScrollDiv, Button } from "react-native-magnus";
import { useFetch, useForm } from "../hooks";
import { CustomSelect } from "../components";
import { ActivityIndicator, Dimensions } from "react-native";
import { handleVerification } from "../services";
const { height } = Dimensions.get("window");

const typeoptions = {
  multiple_choice: { label: "Seleccione", input: false },
  open: { label: "Responde", input: true },
};

const Verification = () => {
  const { setForm, form } = useForm({ initialValues: {} });

  const [btnLoading, setBtnLoading] = useState(false);

  const { data, loading } = useFetch({ url: "/questionnaire", fetch: true });

  return (
    <Box flex={1} flexDir="column" justifyContent="center" pt={25}>
      <Text
        mx={25}
        my={"2xl"}
        fontFamily="Bold"
        lineHeight={34.66}
        fontSize={28}
      >
        Verificación{" "}
        <Image
          source={require("../resources/verified_icon.png")}
          h={22}
          w={22}
        />
      </Text>

      <ScrollDiv
        showsVerticalScrollIndicator={false}
        h={height * 0.6}
        w={"100%"}
        px={25}
        flexDir="column"
      >
        {loading && <ActivityIndicator size={50} />}
        {data?.questions?.map((question) => (
          <CustomSelect
            key={question._id}
            form={form}
            input={typeoptions[question.type]?.input}
            setForm={setForm}
            name={question._id}
            placeholder={typeoptions[question.type]?.label}
            title={question.question}
            selected={form[question._id]}
            options={question.choices}
          />
        ))}
      </ScrollDiv>
      <Button
        loading={btnLoading}
        onPress={handleVerification({
          form,
          id: data?._id,
          setLoading: setBtnLoading,
        })}
        rounded={0}
        bg="primary"
        fontFamily="Bold"
        color="#000"
        w={"100%"}
      >
        Enviar
      </Button>
    </Box>
  );
};

export default Verification;
