import React from "react";
import { Box } from "react-native-magnus";

const ThreeDots = ({ tab }) => {
  return (
    <Box flexDir="row" w={40} style={{ gap: 5 }}>
      <Box w={10} h={10} rounded={10} bg={tab === 1 ? "primary" : "white"} />
      <Box w={10} h={10} rounded={10} bg={tab === 2 ? "primary" : "white"} />
      <Box w={10} h={10} rounded={10} bg={tab === 3 ? "primary" : "white"} />
    </Box>
  );
};

export default ThreeDots;
