const express = require("express");
const app = express();
const port = 3000 || process.env.port;
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
//use curly brackets to bring in "more than one" function with require
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const http = require("http");
const { type } = require("express/lib/response");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("./public/"));

const chatBot = "chatBot";

//run when a client connects (.on() listens for an event, in this case a "connection"), this block welcomes a current user
io.on("connection", (socket) => {
  //   console.log("new websocket connection");

  //3.joins specific room
  socket.on("joinRoom", ({ username, room }) => {
    // makes user object (w/id, username, room), and joins the selected room
    const user = userJoin(socket.id, username, room);

    //this socket joins this particular room
    socket.join(user.room);

    //4a.emits (sends) message from server to the single client
    socket.emit(
      "message",
      formatMessage(chatBot, `welcome to chatCord ${user.username}`)
    );

    //5a.broadcast (emits message to all users except the one that is connecting) when a user connects
    socket.broadcast
      .to(user.room)
      //6a
      .emit(
        "message",
        formatMessage(chatBot, `${user.username} has joined the chat`)
      );

    //send users/room info (to populate sidebar)
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //send message that user is typing
    // socket.on("typing", (msg) => {
    //   console.log(user);
    //   io.to(user.room).emit("message", formatMessage(user.username, msg));
    //   console.log(message);
    // });

    //7. receives text typed by one client, and sends (emits) it out to all other clients
    socket.on("chatMessage", (msg) => {
      //8a.formats message and sends it to all clients in room
      io.to(user.room).emit("message", formatMessage(user.username, msg));
      console.log(msg);
    });

    //9runs when client disconnects (sent to everyone)
    socket.on("disconnect", () => {
      //removes user from the users array
      userLeave(socket.id);
      //10a
      io.to(user.room).emit(
        "message",
        formatMessage(chatBot, `${user.username} has left the chat`)
      );
      //send users/room info (to populate sidebar)
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  });
});

server.listen(port, () => {
  console.log(`server running on port 3000`);
});
