const http = require("http");
const socketIO = require('socket.io');
const app = require("./app");
const server = http.createServer(app);


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Set up the WebSocket server
const io = socketIO(server);

//socket connection 
io.on('connection', (socket) => {
  console.log('A user connected');

  // Add a disconnection event listener
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Add a custom event listener
  socket.on('customEvent', (data) => {
    console.log('Received data:', data);
  });
});


// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = server;

