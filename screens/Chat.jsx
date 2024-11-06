import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Button, Header, Icon, Image, Text, Box } from "react-native-magnus";
import { Audio } from "expo-av";
import { useChatSocket, useFetch } from "../hooks";
import { sendMsg } from "../services/chatService";
import { useRoute } from "@react-navigation/native";
import { useAuthStore } from "../stores";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { useSocket } from "../contexts";

// Componente para renderizar audios
const RenderAudio = ({ audio }) => {
  const [sound, setSound] = useState(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: audio });
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  return (
    <Button bg="blue500" color="white" onPress={playSound}>
      <Icon name="play" fontFamily="Ionicons" fontSize={22} color="#fff" />
    </Button>
  );
};

// Componente principal del Chat
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const user = useAuthStore((state) => state.userInfo);
  const { params } = useRoute();
  const navigation = useNavigation()
  const {socket} = useSocket();

  const sellerName = params?.sellerName || "";
  const userName = params?.userName || "";


  const { data, loading } = useFetch({
    url: `/messages/${params?._id}`,
    fetch: !!params?._id,
  });

  // Hook personalizado para manejar mensajes del socket
  // const {socket} = useChatSocket({
  useChatSocket({
    GiftedChat,
    setMessages,
    connect: !!params._id,
    _id: params._id,
    data,
  });

  useEffect(() => {
    // if (user && user.email) {
    //   initSocket(user);
    // }

    socket.emit('addUsersActive', { id: socket.id, userId: user._id , email:user.email, username: user.userName, role: user.role });

    const handleReceiveMessage = (data) => {
      console.log('Soy tu handle de Chat.jsx',data);
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [data]));
    };

    // Escuchar el mensaje solo una vez
    socket.on("receiveMessage", handleReceiveMessage);

    // Limpiar al desmontar
    return () => {
      console.log('Desconectando socket');
      socket.emit('deleteUsersActive', { id: socket.id, userId: user._id, role: user.role});
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  //NO VA ESTO const socket = io(process.env.EXPO_PUBLIC_WSS_URL);

  // socket.on("connect", () => {
  //   console.log('Connecting socket');
    
  //   socket.emit("addUsersActive", { id: socket.id, username: user.email });
  // });

  // useEffect(() => {
  //   socket.on('recieveMesssage', (data) => console.log(data) )
  // }, [])


  // Función para enviar mensajes
  const onSend = useCallback(
    (newMessages = []) => {
      setMessages((previousMessages) => {
        const message = newMessages[newMessages.length - 1];
        
        if (params._id){
          console.log(params);
          
          socket.emit('newMessage', { to: params.sellerId || params.clientId, message: message })
          console.log("mensaje enviado bro", params.sellerId, params.clientId);
        
        }
        sendMsg({
          _id: params._id,
          msg: {
            ...message,
            to: params.sellerId || params.clientId,
          },
        });

        return GiftedChat.append(previousMessages, newMessages);
      });
    },
    [params._id, user._id, params.sellerId]
  );

  // Renderiza el botón de envío de mensajes
  const renderSend = (props) => {
    return (
      <Button
        bg="transparent"
        color="white"
        rounded={'xl'}
        onPress={() => {
          if (props.text && props.onSend) {
            props.onSend({ text: props.text.trim() }, true);
          }
        }}
      >
        <Icon name="send" fontFamily="Ionicons" fontSize={22} color="#09f" />
      </Button>
    );
  };

  // Renderiza el audio en el mensaje
  const renderMessageAudio = (props) => {
    const { currentMessage } = props;
    if (currentMessage.audio) {
      return <RenderAudio audio={currentMessage.audio} />;
    }
    return null;
  };

  // Renderiza la imagen en el mensaje
  const renderMessageImage = (props) => {
    const { currentMessage } = props;
    if (currentMessage.image) {
      return (
        <Image
          w={"100%"}
          h={200}
          rounded={10}
          source={{ uri: currentMessage.image }}
          // style={{ width: , height: 200, borderRadius: 10 }}
          resizeMode="cover"
        />
      );
    }
    return null;
  };

  return (
    <>
      <Header style={{ paddingTop: '10%' }}>
        <Box style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" fontFamily="Ionicons" fontSize={28} color="#000" />
          </Pressable>
          {/* <Button onPress={() => navigation.goBack()}>Regresar</Button> */}
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginLeft: 20 }}>{sellerName || userName}</Text>
        </Box>
      </Header>
      <GiftedChat
      containerStyle={{ marginBottom: 10, marginTop: 20 }}
        renderAvatar={() => (
          <Image
            rounded={50}
            h={45}
            w={45}
            resizeMode="contain"
            source={{ uri: "https://via.placeholder.com/150/150" }}
          />
        )}
        placeholder="Mensaje"
        alwaysShowSend={true}
        textInputStyle={{
          color: "#000",
          backgroundColor: "#e6e6e6",
          borderRadius: 20,
          paddingHorizontal: 20
        }}
        renderSend={renderSend}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?._id || 1,
        }}
        renderMessageAudio={renderMessageAudio} // Renderiza los audios
        renderMessageImage={renderMessageImage} // Renderiza las imágenes
      />
    </>
  );
};

export default Chat;
