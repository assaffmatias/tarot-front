import { Alert } from "react-native";
import { api } from "../axios";

export const publishComment =
  ({ handleClose, form, id, ready, setLoading }) =>
  async () => {
    if (!ready) return;

    setLoading(true);

    const { msg } = await api.POST(`/reviews/${id}`, form);

    setLoading(false);

    if (!msg) return handleClose();
    else {
      Alert.alert("Publicación", msg);
      handleClose();
    }
  };
