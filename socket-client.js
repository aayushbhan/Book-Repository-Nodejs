// Import the Socket.IO library
const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io("http://localhost:4000");

console.log("connected to server");
// Listen for real-time updates on the "book-added" event
socket.on("book-added", (book) => {
  console.log("New book added: ", book);
  // Update the UI to show the new book
});

// Listen for real-time updates on the "book-updated" event
socket.on("book-updated", (book) => {
  console.log("Book updated: ", book);
  // Update the UI to show the updated book
});

// Listen for real-time updates on the "book-deleted" event
socket.on("book-deleted", (bookId) => {
  console.log("Book deleted: ", bookId);
  // Update the UI to remove the deleted book
});
