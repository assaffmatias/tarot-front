import { Alert } from "react-native";
import { api } from "../axios";

export const handleVerification =
  ({ form, setLoading, id, userid }) =>
    async () => {
      if (Object.values(form).length !== 10) return;

      setLoading(true);
      const { title, msg, status } = await api.POST(`/questionnaire/${id}`, {
        questions: form,
      });
      setLoading(false);

      // const logout = useAuthStore((state) => state.logout);

      if (status === 'ok') {
        const response = await api.PUT(`/user/update/${userid}`, {
          role: 'USER_TAROT'
        })

        Alert.alert(
          "!Enhorabuena!",
          "Estás habilitado como tarotista. El siguiente paso es cerrar sesión, al ingresar nuevamene verás en tu perfil la opción para gestionar tus publicaciones! 😃",
        );
      } else if (msg && title) {
        Alert.alert(title, msg)
      }
    };