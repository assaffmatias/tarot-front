import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useAuthStore, useNotificationStore } from "../stores";

const wssUrl = process.env.EXPO_PUBLIC_WSS_URL;
const MySocket = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const socket = useMemo(() => {
    return io(wssUrl, {
      extraHeaders: token ? { "x-token": token } : {},
      autoConnect: false
    });
  }, [token]);

  useEffect(() => {
    if (userInfo) {
      socket.connect();
      socket.on('connect', () => {
        console.log(userInfo);
        socket.emit("addUsersAppActive", { id: socket.id, userId: userInfo._id, email: userInfo.email, username: userInfo.userName, role: userInfo.role });
        
      });
        
      // socket.emit('addUsersActive', { id: socket.id, userId: userInfo._id , email:userInfo.email, username: userInfo.userName, role: userInfo.role });




      socket.on('addNotification', (notification) => {
        console.log(notification);
        addNotification(notification);
      });
    }

    return () => {
      if (socket) {
        console.log('Disconnecting socket');
        socket.off('connect');
        socket.off('addNotification');
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = useMemo(() => ({
    socket,
    initSocket: () => {
      if (!socket.connected) {
        socket.connect();
      }
    },
    disconnectSocket: () => {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }), [socket]);

  return <MySocket.Provider value={value}>{children}</MySocket.Provider>;
};

export const useSocket = () => useContext(MySocket);

