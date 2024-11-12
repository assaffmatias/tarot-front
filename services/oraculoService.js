import { Alert } from "react-native";
import { api } from "../axios"; // Axios configurado para hacer las solicitudes

export const handleOraculo = async ({ form, clear, setLoading, lastMessages }) => {
  console.log(lastMessages);
  
  setLoading(true);

  try {
    const response = await api.POST("/oraculo", { message: form.text, lastMessages: lastMessages });
    
    if (response.msg === "OK") {
      return { response: response.response }; // La respuesta de la IA
    } else {
      Alert.alert("Error", "No se pudo obtener la respuesta. Intenta de nuevo.");
      return { response: "Lo siento, ocurrió un error. Intenta de nuevo." };
    }
  } catch (error) {
    console.error("Error en la API:", error);
    Alert.alert("Error", "No se pudo conectar con el servidor.");
    return { response: "Lo siento, ocurrió un error. Intenta de nuevo." };
  } finally {
    clear();
    setLoading(false);
  }
};
