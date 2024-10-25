import { useRoute } from "@react-navigation/native";
import React from "react";
import { Box, Image, Text } from "react-native-magnus";

const PayService = () => {
  const { data = {} } = useRoute();

  return (
    <Box>
      <Image source={require("../resources/paypal.png")} h={150} w={150} />
      <Text>PayService</Text>
    </Box>
  );
};

export default PayService;
