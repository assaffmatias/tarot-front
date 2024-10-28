import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const ChatList = () => {
    const navigation = useNavigation()

    const users = [
        { name: 'Matias', msg: 'Este es el mensaje', image: 'https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { name: 'Lucia', msg: 'Hola, ¿cómo estás?', image: '' },
        { name: 'Usuario', msg: 'Este es un mensaje de prueba con 40 dígitos!!!', image: '' },
    ];

    // Función para truncar el mensaje
    const truncateMessage = (msg) => {
        return msg.length > 30 ? `${msg.substring(0, 30)}...` : msg;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Mensajes</Text>
            <ScrollView style={styles.scrollView}>
                {users.map((user, index) => (
                    <Pressable
                        onPress={() => navigation.navigate(stackRoutesNames.CHAT_SERVICE, { _id: "66ee08c0ded49463f9bd6ba5" })}
                        key={index}
                        style={styles.userContainer}>
                        <Image source={{ uri: user.image ? user.image : 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg' }} style={styles.userImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userMsg}>{truncateMessage(user.msg)}</Text>
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
