import React, { useState } from "react";
import { Box } from "react-native-magnus";
import { WelcomeTabs } from "../components";

const Welcome = ({ navigation }) => {
  const [tab, setTab] = useState(1);

  return (
    <Box
      w={"100%"}
      h={"100%"}
      bg={"bgWelcome"}
      alignItems="center"
      justifyContent="center"
    >
      <WelcomeTabs navigation={navigation} setTab={setTab} tab={tab} />
    </Box>
  );
};

export default Welcome;
