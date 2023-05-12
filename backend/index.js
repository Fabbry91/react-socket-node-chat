import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io' // renombro server de socket para no ser confuso
import http from 'http'
import cors from 'cors'

import { PORT } from './config.js'

const users = {}; // Objeto para almacenar los usuarios

const app = express()
//se crea el servidor para pasarle la confg de express 
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

app.use(cors())
app.use(morgan('dev'))

// revisa si alguien esta intentando conctarse
io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    let user; // Variable para almacenar el usuario actual

    if (Object.keys(users).length === 0) { // Si es el primer usuario
        user = { id: socket.id, name: 'User 1' };
    } else { // Si no es el primer usuario
        if (socket.id in users) { // Si el usuario ya existe
            user = users[socket.id];
        } else { // Si el usuario no existe
            const lastIndex = Object.keys(users).length;
            user = { id: socket.id, name: `User ${lastIndex + 1}` };
        }
    }

    users[socket.id] = user; // Agregar o actualizar el usuario en el objeto

    console.log(`User ${user.name} connected`);

    // Escuchar cuando se envía un mensaje
    socket.on('message', (message) => {
        // Generar un emit para responder a los usuarios
        socket.broadcast.emit('message', {
            body: message,
            from: user.name
        });
    });
});

server.listen(PORT)
console.log("Server on port ", PORT)
