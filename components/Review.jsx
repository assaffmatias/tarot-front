import React from "react";
import { Box, Icon, Image, Text } from "react-native-magnus";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Review = ({ data = {} }) => {
  return (
    <Box w={"100%"} mt={"sm"}>
      <Box flexDir="row">
        <Image
          mx={"xs"}
          w={25}
          h={25}
          rounded={20}
          source={{ uri: apiUrl + `/uploads/user/${data?.user?._id}` }}
        />
        <Text mx={"xs"} fontFamily="Regular" color="gray-dark" fontSize={"lg"}>
          {data?.user?.userName ?? ".."}
        </Text>
        <Icon
          mx={"xs"}
          name="star"
          fontFamily="AntDesign"
          fontSize={22}
          color="primary"
        />
        <Text mx={"xs"}>{data?.rate ?? "-/-"}</Text>
      </Box>
      <Text my={"lg"} fontFamily="Regular" color="gray" fontSize={"lg"}>
        {data?.message ?? "..."}
      </Text>
    </Box>
  );
};

export default Review;
