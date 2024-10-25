import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Button, Header, Icon, Image, Text } from "react-native-magnus";
import { Audio } from "expo-av";
import { useChatSocket, useFetch } from "../hooks";
import { sendMsg } from "../services/chatService";
import { useRoute } from "@react-navigation/native";
import { useAuthStore } from "../stores";

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

  const { data, loading } = useFetch({
    url: `/messages/${params?._id}`,
    fetch: !!params?._id,
  });

  // Hook personalizado para manejar mensajes del socket
  useChatSocket({
    GiftedChat,
    setMessages,
    connect: !!params._id,
    _id: params._id,
    data,
  });

  // Función para enviar mensajes
  const onSend = useCallback(
    (newMessages = []) => {
      setMessages((previousMessages) => {
        if (params._id)
          sendMsg({
            _id: params._id,
            msg: newMessages[newMessages.length - 1],
          });

        return GiftedChat.append(previousMessages, newMessages);
      });
    },
    [params._id]
  );

  // Renderiza el botón de envío de mensajes
  const renderSend = (props) => {
    return (
      <Button
        bg="blue500"
        color="white"
        onPress={() => {
          if (props.text && props.onSend) {
            props.onSend({ text: props.text.trim() }, true);
          }
        }}
      >
        <Icon name="send" fontFamily="Ionicons" fontSize={22} color="#fff" />
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
      <Header>
        <Button>Finalizar consulta</Button>
      </Header>
      <GiftedChat
        renderAvatar={() => (
          <Image
            rounded={50}
            h={45}
            w={45}
            resizeMode="contain"
            source={{ uri: "https://via.placeholder.com/150/150" }}
          />
        )}
        placeholder="Escribe aquí"
        alwaysShowSend={true}
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
