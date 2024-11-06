import { io } from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_WSS_URL, {
  autoConnect: false
});

export const initSocket = (user) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("addUsersActive", { id: socket.id, username: user.email });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;