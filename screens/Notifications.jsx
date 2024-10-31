import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { useAuthStore } from "../stores";
import { api } from "../axios";
import { Header } from "react-native-magnus";

const Notifications = () => {
    const navigation = useNavigation();

    const notifications = [
        { text: 'Esta es una notificación' }
    ]

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
                    <View>
                        <Text>{notif.text}</Text>
                    </View>
                    // <Pressable
                    //     onPress={() => navigation.navigate(stackRoutesNames.CHAT_SERVICE, { _id: chat._id, sellerName: chat.seller?.userName, sellerId: chat.seller?._id })}
                    //     key={index}
                    //     style={styles.userContainer}>
                    //     <Image
                    //         source={{ uri: chat.seller?.image || 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg' }}
                    //         style={styles.userImage}
                    //     />
                    //     <View style={styles.textContainer}>
                    //         <Text style={styles.userName}>{chat.seller?.userName}</Text>
                    //         <Text style={styles.userMsg}>{truncateMessage(chat.service.description)}</Text>
                    //     </View>
                    // </Pressable>
                ))}
            </ScrollView>
        </View>
    )
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '5%',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    headerText: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center'
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
    noMSG: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 500
    },
    noMSGText: {
        fontSize: 20
    }
});
