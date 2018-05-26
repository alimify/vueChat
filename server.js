const io = require("socket.io").listen(8000).sockets;
io
  ? console.log("Socket Server connected...")
  : console.log("Socket server is not connected...");

io.on("connection", socket => {
  let name;

  io.clients((error, clients) => {
    if (error) throw error;
    io.emit("connectionCount", clients.length);
  });

  socket.on("newMessage", data => {
    socket.broadcast.emit("newMessage", data);
  });

  socket.on("userTyping", data => {
    socket.broadcast.emit("userTyping", data);
  });

  socket.on("join", data => {
    socket.join("join");
    name = data;
    socket.broadcast.emit("alertText", name + " have joined...");
    socket.emit("alertText",name+", Welcome");
    io.in("join").clients((error, clients) => {
      if (error) throw error;
      io.emit("onlineCount", clients.length);
    });
  });

  socket.on("disconnect", () => {
    io.clients((error, clients) => {
      if (error) throw error;
      io.emit("connectionCount", clients.length);
    });
    io.in("join").clients((error, clients) => {
      if (error) throw error;
      io.emit("onlineCount", clients.length);
    });
    socket.broadcast.emit("alertText", name + " have been left...");
  });
});
