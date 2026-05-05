const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

// Create Express app
const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/collabDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Document Schema
const Document = mongoose.model(
  "Document",
  new mongoose.Schema({
    _id: String,
    data: Object,
  })
);

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("get-document", async (id) => {
    let document = await Document.findById(id);

    if (!document) {
      document = await Document.create({
        _id: id,
        data: {},
      });
    }

    socket.join(id);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(id).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(id, { data });
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});