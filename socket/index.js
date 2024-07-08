const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
  // listen to the connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some(user => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id
      });
    console.log("---", userId);
    console.log(onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  // the server receive the data and run sendMessage
  // it find the receive user by the id
  // if found the user,
  // the event getMessage and getNotification is run
  // and the receiver will receive the message4

  // send message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(5000);