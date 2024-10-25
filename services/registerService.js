import { Alert } from "react-native";
import { api } from "../axios";
import { useAuthStore } from "../stores";

export async function registerUser(form) {
  try {
    const { msg } = await api.POST("/auth/register", form);

    if (!msg) return;

    Alert.alert("¡Exito!", msg);
  } catch (error) {
    Alert.alert("¡A ocurrido un error!", error.message);
  }
}

export async function recoverPassword(form) {
  try {
    const { msg } = await api.POST("/auth/recover", form);

    if (!msg) return;
    Alert.alert("¡Exito!", msg);
  } catch (error) {
    Alert.alert("¡A ocurrido un error!", error.message);
  }
}

export async function recoverCode(form) {
  const restoreSession = useAuthStore.getState().restoreSession;
  try {
    const { msg, ...rest } = await api.POST("/auth/code", form);

    if (!msg) return;

    console.log({ rest });

    Alert.alert(
      "¡Éxito!",
      msg,
      [
        {
          text: "OK",
          onPress: () => restoreSession({ ...rest, auth: true }),
        },
      ],
      { cancelable: false }
    );
  } catch (error) {
    Alert.alert("¡Ha ocurrido un error!", error.message);
  }
}
