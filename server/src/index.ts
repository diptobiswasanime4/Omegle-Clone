import { Server } from "socket.io";
import getRandomElemFromArray from "./utils/getRandomElemFromArray.js";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

let users = [];

io.on("connection", async (socket) => {
  socket.emit("first-message", "This is my first message from server.");

  socket.on("send-user-connected", (data) => {
    const user = { socketId: socket.id, userId: data, connected: false };
    const notConnectedUsers = users.filter((u) => u.connected == false);
    const anotherUser = getRandomElemFromArray(notConnectedUsers);
    users.push(user);
    if (anotherUser) {
      users = users.map((u) => {
        if (u.socketId === socket.id || u.socketId === anotherUser.socketId) {
          return { ...u, connected: true };
        }
        return u;
      });
      socket
        .to(anotherUser.socketId)
        .emit("match", { firstUser: anotherUser, secondUser: user });
    }
    console.log(users);
    socket.emit("user-connected", users);
  });

  socket.on("match-back", (data) => {
    console.log(data);
    console.log(data.msg);
    socket.to(data.recipientSocketId).emit("match-back-chat-message", "Hi");
  });
  //   socket.on("send-chat-message", (data) => {
  //     socket.broadcast.emit("chat-message", data);
  //   });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.socketId != socket.id);
    socket.emit("user-connected", users);
  });
});
