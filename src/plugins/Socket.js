// plugins/Socket.js
import { Server } from "socket.io";

let ioInstance = null;

export function initSocket(server) {
  if (!ioInstance) {
    ioInstance = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
      },
    });

    ioInstance.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // System message
      socket.broadcast.emit("message", {
        sender: "T-CHATS",
        message: "A new user has joined!",
        time: new Date().toLocaleTimeString(),
      });

      // Listen for user chat messages
      socket.on("send-message", (data, callback) => {
        if (!data.message) return callback("Message is empty");

        ioInstance.emit("message", {
          sender: data.sender,
          message: data.message,
          time: new Date().toLocaleTimeString(),
        });
        callback();
      });

      socket.on("disconnect", () => {
        ioInstance.emit("message", {
          sender: "T-CHATS",
          message: "A user has left!",
          time: new Date().toLocaleTimeString(),
        });
      });

      // Optional: Listen for alerts created via socket
      socket.on("create-alert", async (alertData, callback) => {
        // handle saving alert in your service/repo
        const newAlert = await createAlert(alertData); // your function
        ioInstance.emit("new-alert", newAlert);
        callback(newAlert);
      });
    });
  }

  return ioInstance;
}

export function getSocket() {
  if (!ioInstance) throw new Error("Socket not initialized");
  return ioInstance;
}
