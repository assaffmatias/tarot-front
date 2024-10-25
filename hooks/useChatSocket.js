import { useEffect } from "react";
import { useSocket } from "../contexts";

const useChatSocket = ({
  _id = null,
  connect = false,
  setMessages,
  data = [],
  GiftedChat,
}) => {
  const { socket } = useSocket();

  useEffect(() => {
    const handleMsg = (msg) => {
      const formattedMsg = {
        _id: msg._id,
        text: msg.message,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.from._id,
          name: msg.from.name,
          avatar: msg.from.img || "https://via.placeholder.com/150/150",
        },
        image: msg.media?.img || null,
        audio: msg.media?.audio || null,
      };

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, [formattedMsg])
      );
    };

    if (_id && connect) {
      socket.on("new-message", handleMsg);
    }

    return () => {
      socket.off("new-message", handleMsg); // Limpieza del evento
    };
  }, [_id, connect, socket, setMessages]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedMessages = data.map((msg) => ({
        _id: msg._id,
        text: msg.message,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.from._id,
          name: msg.from.name,
          avatar: msg.from.img || "https://via.placeholder.com/150/150",
        },
        image: msg.media?.img || null,
        audio: msg.media?.audio || null,
      }));

      // Carga inicial de mensajes
      setMessages(formattedMessages);
    }
  }, [data, setMessages]);
};

export default useChatSocket;
