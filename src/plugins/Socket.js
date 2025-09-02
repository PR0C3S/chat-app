import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
      },
    });
  }
  return io;
};

export const getSocket = () => {
  if (!io) throw new Error("Socket.IO no ha sido inicializado");
  return io;
};
