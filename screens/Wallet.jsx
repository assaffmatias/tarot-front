import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { Checkbox, Tag } from "react-native-magnus";
import { api } from "../axios"; // Asegúrate de que este archivo esté configurado correctamente
import { useAuthStore } from "../stores";

const Wallet = () => {
    const wallets = [
        { id: "paypal", name: "Paypal" },
        { id: "stripe", name: "Mastercard / Visa" },
    ];

    const [selectedWallets, setSelectedWallets] = useState([]);
    const [paypalEmail, setPaypalEmail] = useState("");
    const [stripeAlias, setStripeAlias] = useState("");
    const user = useAuthStore((state) => state.userInfo);

    console.log('USER:', user);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.GET(`/user/${user._id}`);
                const { paypal_email, stripe_alias } = response.user;

                console.log('RESPONSSE:', response.user);


                if (paypal_email) {
                    setPaypalEmail(paypal_email);
                    setSelectedWallets((prev) => [...prev, "paypal"]);
                }
                if (stripe_alias) {
                    setStripeAlias(stripe_alias);
                    setSelectedWallets((prev) => [...prev, "stripe"]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                Alert.alert("Error", "Hubo un problema al cargar los datos del usuario.");
            }
        };
        fetchData();
    }, [user._id]);

    const handleWalletSelection = (id) => {
        if (selectedWallets.includes(id)) {
            setSelectedWallets(selectedWallets.filter((wallet) => wallet !== id));
        } else {
            setSelectedWallets([...selectedWallets, id]);
        }
    };

    const handleSave = async () => {
        const data = {
            paypal_email: selectedWallets.includes("paypal") ? paypalEmail : null,
            stripe_alias: selectedWallets.includes("stripe") ? stripeAlias : null,
        };

        try {
            await api.PUT(`/user/update/${user._id}`, data);
            Alert.alert("Éxito", "Los datos han sido actualizados correctamente.");
        } catch (error) {
            console.error("Error updating data:", error);
            Alert.alert("Error", "Hubo un problema al guardar los datos.");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", color: "#191970", marginTop: 10 }}>
                Selecciona tu billetera
            </Text>
            {/* <Text style={{ fontSize: 30, fontWeight: "bold", color: "#191970" }}>Medios de Pago</Text> */}
            <Text style={{ textAlign: "center", fontWeight: '600', marginBottom: 40, marginTop: 20 }}>
                En esta sección puedes gestionar tus medios de pagos. Actualmente puedes cobrar por tus servicios a través de
                Paypal, Mastercard / Visa. Es necesario que selecciones al menos uno, en caso contrario los usuarios no podrán
                contratar tus servicios.
            </Text>

            {wallets.map((wallet) => (
                <View
                    key={wallet.id}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                        marginHorizontal: 10,
                        width: "95%",
                    }}
                >
                    <Checkbox
                        checked={selectedWallets.includes(wallet.id)}
                        onChange={() => handleWalletSelection(wallet.id)}
                        borderColor="#191970"
                        activeColor="#191970"
                        inactiveColor="#191970"
                    />
                    <Tag ml={"sm"} bg="#191970" color="white" fontFamily="Medium">
                        {wallet.name}
                    </Tag>
                </View>
            ))}

            {selectedWallets.includes("paypal") && (
                <View style={{ marginTop: 20, width: "100%" }}>
                    <Text style={{ color: "#191970", marginBottom: 5 }}>Email de PayPal</Text>
                    <TextInput
                        value={paypalEmail}
                        onChangeText={setPaypalEmail}
                        placeholder="Ingresa tu correo de PayPal"
                        style={{
                            borderWidth: 1,
                            borderColor: "#191970",
                            borderRadius: 10,
                            padding: 10,
                            width: "100%",
                        }}
                    />
                </View>
            )}

            {selectedWallets.includes("stripe") && (
                <View style={{ marginTop: 20, width: "100%" }}>
                    <Text style={{ color: "#191970", marginBottom: 5 }}>Alias de Stripe</Text>
                    <TextInput
                        value={stripeAlias}
                        onChangeText={setStripeAlias}
                        placeholder="Ingresa tu alias para Stripe"
                        style={{
                            borderWidth: 1,
                            borderColor: "#191970",
                            borderRadius: 10,
                            padding: 10,
                            width: "100%",
                        }}
                    />
                </View>
            )}

            <Pressable
                onPress={handleSave}
                style={{
                    backgroundColor: "#191970",
                    width: "100%",
                    paddingVertical: 15,
                    borderRadius: 10,
                    marginTop: 30,
                }}
            >
                <Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>Guardar</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Wallet;
