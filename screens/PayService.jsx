import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator } from "react-native";
import { api } from "../axios";
import { useAuthStore } from "../stores";
import { useRoute } from "@react-navigation/native";

const PayService = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [approvalUrl, setApprovalUrl] = useState(null);

  const user = useAuthStore((state) => state.userInfo);
  const route = useRoute();

  const { data = {}, price } = route.params || {};

  useEffect(() => {
    // Llama a la API para obtener el approvalUrl solo una vez
    const createPayment = async () => {
      try {
        const response = await api.POST("/transaction", {
          currency: "USD",
          amount: `${price}.00`,
        });
        setApprovalUrl(response.approvalUrl);
      } catch (error) {
        console.error("Error al obtener approvalUrl:", error);
      }
    };

    createPayment();
  }, []);

  const successTransaction = async (url) => {
    const payerId = url.split("=")[2];
    await api.POST("/transaction/success", {
      client: user._id,
      seller: data.user._id,
      price: `${price}.00`,
      service: data._id,
      paypal_id: payerId,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
      {approvalUrl && (
        <WebView
          source={{ uri: approvalUrl }}
          onLoad={() => setLoading(false)}
          onNavigationStateChange={(event) => {
            if (event.url.includes("success")) {
              alert("Pago completado");
              successTransaction(event.url);
              navigation.goBack();
            }
          }}
        />
      )}
    </View>
  );
};

export default PayService;
