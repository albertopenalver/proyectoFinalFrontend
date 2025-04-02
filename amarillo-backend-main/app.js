
const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const product = require("./routes/product.route");
const user = require("./routes/user.route");
const empresas = require('./routes/empresa.route');
const category = require("./routes/category.route");
const proveedor = require("./routes/proveedor.route");
const movimientos = require("./routes/movimientos.route");
const message = require("./routes/message.route");
const mensaje = require("./routes/mensaje.route");
const guardarMovimientos = require("./routes/guardarmovimientos.route");

const http = require('http');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

app.use("/product", product);
app.use("/user", user);
app.use('/empresas', empresas);
app.use("/category", category);
app.use("/proveedor", proveedor);
app.use("/movimientos", movimientos);
app.use("/guardar", guardarMovimientos);
app.use("/msg", message);
app.use("/mensaje", mensaje);
app.use('/uploads', express.static('uploads'));


const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: ['*','https://amarillo-frontend.onrender.com','http://localhost:5173'],
    methods: ['GET', 'POST','DELETE','PUT','PATCH'],
  },
});

const connectedUsers = {}; // Mapa para rastrear usuarios conectados

io.on('connection', (socket) => {
  console.log('Nueva conexión establecida:', socket.id);

  let currentUser = null;

  // Manejar evento de usuario conectado
  socket.on('user', (msg) => {
    currentUser = msg.nombre;
    connectedUsers[currentUser] = socket.id;
    console.log(`Usuario conectado: ${currentUser}`);
  });

  // Manejar selección de usuario
  socket.on('select_user', ({ sender, recipient }) => {
    const recipientSocketId = connectedUsers[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_selected', { sender });
      console.log(`Usuario seleccionado: ${recipient}`);
    } else {
      console.log(`Usuario ${recipient} no está conectado`);
    }
  });

  // Manejar mensajes privados
  socket.on('send_private_message', ({ sender, recipient, message }) => {
    const recipientSocketId = connectedUsers[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_private_message', { sender, message });
      console.log(`Mensaje privado enviado de ${sender} a ${recipient}: ${message}`);
    } else {
      console.log(`Usuario ${recipient} no está conectado`);
    }
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${currentUser}`);
    delete connectedUsers[currentUser];
  });
});
/*
wss.on('connection', (ws, req) => {
  const token = req.url.split('?token=')[1]; // token is passed as a query parameter
  if (!token) {
    console.error("Token missing in WebSocket request");
    ws.close(1008, 'Token missing');
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      ws.close(1008, 'Invalid token');
      return;
    }

    try {
      const Usuario = require('./models/user.model');
      console.log("Decoded userId:", decoded.userId); // Log the decoded userId
      const user = await Usuario.findOne({ nombre: decoded.userId }); // Use nombre to find the user
      
      if (!user) {
        console.error("User not found for nombre:", decoded.userId);
        ws.close(1008, 'User not found');
        return;
      }

      ws.user = user; // Associate user with WebSocket connection
      console.log("WebSocket connection established for user:", decoded.userId);

      ws.on('message', async (messageData) => {
        const Message = require('./models/message.model');
        const message = new Message({
          content: messageData,
          sender: user.nombre, 
          userId: user._id, // Include userId
          timestamp: new Date()
        });
        await message.save();
        

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              sender: user.nombre,
              content: messageData,
              userId: user._id, 
              timestamp: message.timestamp,
            }));
            console.log("Message broadcast to user:", client.user.nombre); // Log the broadcast
          }
        });
      });
    } catch (e) {
      console.error("Error handling WebSocket connection:", e.message);
      ws.close(1011, "Server error");
    }
  });
}); */

const mongoDB =
"mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.DB_SERVER +
  "/" +
  process.env.DB_NAME +
  "?retryWrites=true&w=majority";

async function main() {
  const isTest = process.env.NODE_ENV === 'test';

  if (!isTest) {
    await mongoose.connect(mongoDB);
    console.log("MongoDB conectado!");
  } else {
    console.log("MongoMemoryServer conectado!");
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    console.log("Conectando a MongoDB con la URI:", uri);
    await mongoose.connect(uri);
  }
}

main().catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = { main };


