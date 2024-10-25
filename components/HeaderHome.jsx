import { Dimensions } from "react-native";
import { Button, Header, Icon } from "react-native-magnus";
const { width } = Dimensions.get("window");

const HeaderHome = () => {
  return (
    <Header
      p="2xl"
      w={width}
      shadow={"none"}
      alignment="center"
      justifyContent="center"
      bg="red"
      prefix={
        <Button bg="transparent" mt={"2xl"}>
          <Icon
            fontFamily="Ionicons"
            name="notifications"
            fontSize={20}
            color="pink"
          />
        </Button>
      }
    />
  );
};

export default HeaderHome;
