import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const customTheme = {
  colors: {
    bgWelcome: "#191970",
    primary: "#FFD700",
    secondary: "#800080",
    visited: "#7856FF",
    accent: "#00A1C5",
    pink: "#FF7B9B",
    gray: "#737373",
    "gray-dark": "#545252",
  },
  shadows: {
    "big-white": {
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
    },
  },
};

const GLOBAL = StyleSheet.create({
  screenContainer: {
    width,
    minHeight: height,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 5,
  },
  column: {
    flexDirection: "column",
    gap: 5,
  },
  space: {
    flex: 1,
    flexGrow: 1,
  },
  removePadding: {
    padding: 0,
  },
  removeMargin: {
    margin: 0,
  },
});

export { GLOBAL, customTheme };
