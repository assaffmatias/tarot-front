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
  console.log(user._id);
  const route = useRoute();

  const { data = {} } = route.params || {};
  console.log(data);

  useEffect(() => {
    // Llama a la API para obtener el approvalUrl solo una vez
    const createPayment = async () => {
      try {
        const response = await api.POST("/transaction", {
          currency: "USD",
          amount: "10.00",
        });
        setApprovalUrl(response.approvalUrl);
      } catch (error) {
        console.error("Error al obtener approvalUrl:", error);
      }
    };

    createPayment();
  }, []);

  // const successTransaction = async () => {
  //   const response = await api.POST("/transaction/success", {
  //     client: "USD",
  //     seller: "10.00",
  //     price: "",
  //     service: "",
  //     paypal_id: "",
  //   });
  // };

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
              // successTransaction();
              navigation.goBack();
            }
          }}
        />
      )}
    </View>
  );
};

export default PayService;
