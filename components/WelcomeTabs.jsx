import React from "react";
import WelcomeTab1 from "./WelcomeTab1";
import WelcomeTab2 from "./WelcomeTab2";
import WelcomeTab3 from "./WelcomeTab3";

const Tabs = {
  1: WelcomeTab1,
  2: WelcomeTab2,
  3: WelcomeTab3,
};

const WelcomeTabs = ({ navigation, tab, setTab }) => {
  const CurrentTab = Tabs[tab];

  return <CurrentTab setTab={setTab} navigation={navigation} />;
};

export default WelcomeTabs;
