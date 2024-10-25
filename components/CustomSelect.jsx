import React, { useRef } from "react";
import { Dimensions } from "react-native";
import { Box, Button, Icon, Input, Select, Text } from "react-native-magnus";

const { width } = Dimensions.get("window");

const handleChange =
  ({ name = "lorem", setForm }) =>
  (value) =>
    setForm(name, value);

const CustomSelect = ({
  placeholder = "placeholder",
  input = false,
  options = [],
  setForm,
  form,
  selected,
  name,
  title,
}) => {
  const selectRef = useRef(null);

  return (
    <>
      <Box>
        <Text mt={"xl"} fontFamily="Regular">
          {title}
        </Text>
        <Button
          bg="#f4f4f4"
          rounded={10}
          h={36}
          p={0}
          shadow={"xs"}
          w={"100%"}
          my={"lg"}
          onPress={() => {
            if (selectRef.current) {
              selectRef.current.open();
            }
          }}
        >
          <Text>{selected ?? placeholder}</Text>
          <Box
            position="absolute"
            w={width * 0.9}
            h={"100%"}
            justifyContent="center"
          >
            <Icon
              position="absolute"
              right={15}
              fontSize={15}
              name="chevron-thin-down"
              fontFamily="Entypo"
              color="gray"
            />
          </Box>
        </Button>
      </Box>
      <Select
        onSelect={handleChange({ name, setForm })}
        ref={selectRef}
        value={form.lorem}
        title={title}
        mt="md"
        pb="2xl"
        message="Seleccione"
        roundedTop="xl"
        data={input ? [0] : options}
        renderItem={(item) =>
          input ? (
            <Input
              style={{ alignSelf: "center" }}
              w={"90%"}
              placeholder={placeholder}
              onChangeText={handleChange({ name, setForm })}
              value={form[name]}
            />
          ) : (
            <Select.Option
              prefix={
                <Icon
                  fontSize={22}
                  name="dot-single"
                  fontFamily="Entypo"
                  color="gray"
                />
              }
              value={item}
              py="md"
              px="xl"
            >
              <Text>{item}</Text>
            </Select.Option>
          )
        }
      />
    </>
  );
};

export default CustomSelect;
