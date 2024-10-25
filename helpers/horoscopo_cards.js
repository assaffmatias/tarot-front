import { Image } from "react-native-magnus";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const horoscopo_cards = [
  {
    Img: () => (
      <Image
        source={require("../resources/11_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 1,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/12_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 2,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/13_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 3,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/21_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 4,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/22_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 5,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/23_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 6,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/31_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 7,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/32_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 8,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/33_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 9,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/41_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 10,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/42_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 11,
  },
  {
    Img: () => (
      <Image
        source={require("../resources/43_card.png")}
        w={width * 0.2}
        height={height * 0.2}
      />
    ),
    value: 12,
  },
];
