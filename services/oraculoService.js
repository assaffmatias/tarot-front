import { Alert } from "react-native";
import { api } from "../axios"; // Axios configurado para hacer las solicitudes

export const handleOraculo = async ({ user, form, clear, setLoading, lastMessages, selectedCardNames }) => {
  console.log(selectedCardNames);
  
  setLoading(true);

  try {
    const response = await api.POST("/oraculo", { user, message: form.text, lastMessages: lastMessages, cartas: selectedCardNames });

    console.log('REPONSE:', response);
    
    
    if (response.msg === "OK") {
      return { response: response.response }; // La respuesta de la IA
    } else if (response.msg === 'No tienes suficientes chatCoins') {
      return { response: "Ops! No tienes monedas suficientes" };
    } else {
      return { response: "Lo siento, no estoy disponible en este momento." };
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
