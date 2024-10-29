import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { useAuthStore } from "../stores";
import { api } from "../axios";

const ChatList = () => {
    const navigation = useNavigation();
    const [chatList, setChatList] = useState([]);
    const user = useAuthStore((state) => state.userInfo);

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await api.GET(`/transaction/client/${user._id}`);
                const sortedChats = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ordena por fecha de creación, más reciente primero
                setChatList(sortedChats);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
        getChats();
    }, []);

    // Función para truncar el mensaje
    const truncateMessage = (msg) => {
        return msg.length > 30 ? `${msg.substring(0, 30)}...` : msg;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Mensajes</Text>
            <ScrollView style={styles.scrollView}>
                {chatList.map((chat, index) => (
                    <Pressable
                        onPress={() => navigation.navigate(stackRoutesNames.CHAT_SERVICE, { _id: chat._id, sellerName: chat.seller?.userName, sellerId: chat.seller?._id })}
                        key={index}
                        style={styles.userContainer}>
                        <Image
                            source={{ uri: chat.seller?.image || 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg' }}
                            style={styles.userImage}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.userName}>{chat.seller?.userName}</Text>
                            <Text style={styles.userMsg}>{truncateMessage(chat.service.description)}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '15%',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20,
    },
    scrollView: {
        width: '100%',
        paddingHorizontal: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
    },
    userMsg: {
        fontSize: 14,
        color: '#555',
    },
});
