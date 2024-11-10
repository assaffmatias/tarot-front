import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore, useNotificationStore } from "../stores";
import { useSocket } from "../contexts";
import { FontAwesome } from '@expo/vector-icons';  // Importar iconos de FontAwesome
import { Header } from "react-native-magnus";

const Notifications = () => {
    const navigation = useNavigation();
    const { socket } = useSocket();
    const user = useAuthStore((state) => state.userInfo);
    const notifications = useNotificationStore((state) => state.notifications);
    const clearNotification = useNotificationStore((state) => state.clearNotification);

    //   const changePendingNotification = (id) => {
    //     if (socket) {
    //       socket.emit("changePendingNotification", { id, value: false });
    //       clearNotification(id); // Eliminar la notificación del estado
    //     }
    //   };

    // const sendNotification = () => {

    //     if (socket) {
    //         const testNotification = {
    //             userId: user._id,
    //             email: user.email,
    //             message: 'Test notification from ' + user.email,
    //         };

    //         console.log('Notification pressed and data: ', user);
    //         socket.emit('sendNotification', testNotification)

    //     }
    // }

    const changePendingNotification = (id) => {
        console.log('me han llamado?');

        if (socket) {
            socket.emit('changePendingNotification', { id, value: false }
            )
            clearNotification(id);
        }
    }

    return (
        <View style={styles.container}>
            <Header style={styles.header}>
                <Text style={styles.headerText}>Notificaciones</Text>
            </Header>
            <ScrollView style={styles.scrollView}>
                {notifications.length === 0 && (
                    <View style={styles.noMSG}>
                        <Text style={styles.noMSGText}>No tienes notificaciones</Text>
                    </View>
                )}
                {notifications.map((notif, index) => (
                    <View key={notif.id} style={styles.notificationContainer}>
                        <View style={styles.notificationTextContainer}>
                            <Text style={styles.notificationText}>{notif.message}</Text>
                        </View>
                        {/* <Pressable onPress={() => changePendingNotification(notif._id)} style={styles.deleteButton}>
                            <FontAwesome name="trash" size={20} color="red" />
                        </Pressable> */}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: '5%',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        paddingHorizontal: 20
    },
    headerText: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        color: '#191970', // Color personalizado para el encabezado
        paddingTop: '3%'
    },
    scrollView: {
        width: '100%',
        paddingHorizontal: 20,
    },
    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0', // Fondo suave para cada notificación
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Para dar efecto de sombra en Android
    },
    notificationTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    notificationText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        lineHeight: 22,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#ffe6e6', // Fondo suave para el botón de eliminar
    },
    noMSG: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 500,
    },
    noMSGText: {
        fontSize: 20,
        color: '#888',
    },
});
