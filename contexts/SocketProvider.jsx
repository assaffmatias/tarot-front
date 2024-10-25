import { io } from "socket.io-client";
import { useAuthStore } from "../stores";
import { createContext, useContext, useEffect, useMemo } from "react";

const wssUrl = process.env.EXPO_PUBLIC_WSS_URL;

const MySocket = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  const socket = useMemo(() => {
    return io(wssUrl, {
      extraHeaders: token ? { "x-token": token } : {},
    });
  }, [token]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return <MySocket.Provider value={{ socket }}>{children}</MySocket.Provider>;
};

export const useSocket = () => useContext(MySocket);
