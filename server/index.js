var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
}); 

var i = 0;

socketIo.of('/abc').on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id);
  i += 1;

  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});


server.listen(3001, () => {
    console.log('Server đang chay tren cong 3001');
});

setInterval(() => {console.log(i)}, 2000)