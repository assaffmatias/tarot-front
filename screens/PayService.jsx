import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator } from "react-native";
import { api } from "../axios";
import { useAuthStore } from "../stores";
import { useRoute } from "@react-navigation/native";
import { useSocket } from "../contexts";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { useNavigation } from "@react-navigation/native";

const PayService = () => {
  const [loading, setLoading] = useState(true);
  const [approvalUrl, setApprovalUrl] = useState(null);
  const { socket } = useSocket();
  const user = useAuthStore((state) => state.userInfo);
  const route = useRoute();
  const navigation = useNavigation()

  const { data = {}, price, hiredMinutes, through } = route.params || {};
  console.log(hiredMinutes, price);
  

  useEffect(() => {
    // Llama a la API para obtener el approvalUrl solo una vez
    const createPayment = async () => {
      try {
        const response = await api.POST("/transaction", {
          currency: "USD",
          amount: `${price}.00`,
          hiredMinutes,
          // client: user._id,
          // seller: data.user._id
        });
        setApprovalUrl(response.approvalUrl);
      } catch (error) {
        console.error("Error al obtener approvalUrl:", error);
      }
    };
    const createPaymentStripe = async () => {
      try {
        console.log(data);
        
        const response = await api.POST("/transaction/cc", {
          currency: "USD",
          amount: `${price}.00`,
          client: user._id,
          seller: data.user._id,
          service: data._id,
          hiredMinutes
        });
        console.log(response.approvalUrl);
        setApprovalUrl(response.approvalUrl);
      } catch (error) {
        console.error("Error al obtener approvalUrl:", error);
      }
    };
    console.log(through);
    if (through === "paypal") createPayment();
    else if (through === "stripe") createPaymentStripe();
  }, []);

  const successTransaction = async (url) => {
    console.log(url);

    const urlObj = new URL(url);
    console.log(urlObj.pathname);
    
    if (urlObj.pathname === "/success/cc") {
      // await api.POST("/transaction/success/cc", {
      //   client: user._id,
      //   seller: data.user._id,
      //   price: `${price}.00`,
      //   service: data._id,
      //   client_name: user.userName,
      //   seller_name: data.user.userName
      // });
    } else if (urlObj.pathname === "/success") {
      const token = urlObj.searchParams.get("token");
      const payerId = urlObj.searchParams.get("PayerID");
      await api.POST("/transaction/success", {
        client: user._id,
        seller: data.user._id,
        price: `${price}.00`,
        service: data._id,
        token: token,
        paypal_id: payerId,
      });
    }
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
              alert(`Pago exitoso!`);
              successTransaction(event.url);
              navigation.navigate(stackRoutesNames.HOME);
            }
            if (event.url.includes("cancel")) {
              alert(`Pago cancelado!`);
              // successTransaction(event.url);
              navigation.goBack();
            }
          }}
        />
      )}
    </View>
  );
};

export default PayService;
