// ENV
require('dotenv').config();

// Connect MongoDB
const mongoose = require('mongoose');
require ("./database/mongoose.js")

/** Passport Configuration */
const passport = require('passport');
require('./config/passport')(passport);

// INIT EXPRESS
const express = require('express');

const morgan = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
// const enforce = require("express-sslify")

// SOCKET IO
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        // methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        // credentials: true
    }
});

const {
    ADD_MESSAGE,
    CREATE_MESSAGE_CONTENT,
    GET_ROOMS,
    GET_ROOM_USERS,
    UPDATE_ROOM_USERS,
    FILTER_ROOM_USERS
} = require('./actions/socketio')
const {JOIN_ROOM} = require('./helpers/socketEvents')

// INIT ROUTES
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const profileRoutes = require('./routes/profile')
const messageRoutes = require('./routes/message')
const roomRoutes = require('./routes/room')

// EXPRESS APP
app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.set('io', io);

// ROUTES DEFINE
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/room', roomRoutes)

let userTypings = {};

/** Socket IO Connections */
io.on('connection', socket => {
    let currentRoomId = null;
    console.log("Socket Io Connected")

    /** Socket Events */
    socket.on('disconnect', async () => {
        try {
            if (currentRoomId) {
                console.log("currentRoomId", currentRoomId)
                /** Filter through users and remove user from user list in that room */
                const roomState = await FILTER_ROOM_USERS({
                    roomId: currentRoomId,
                    socketId: socket.id
                });

                const updateUserList =  await GET_ROOM_USERS({
                    room: {_id: currentRoomId}
                })
                socket.broadcast.to(currentRoomId).emit('updateUserList', JSON.stringify(updateUserList));

                const rooms = await GET_ROOMS()
                socket.broadcast.emit('updateRooms', JSON.stringify({room: rooms}));

                // const receivedNewMessage = await ADD_MESSAGE({
                //     room: { _id: roomState.previous._id },
                //     user: null,
                //     content: CREATE_MESSAGE_CONTENT(roomState, socket.id),
                //     admin: true
                // })

                socket.broadcast.to(currentRoomId).emit('receivedNewMessage',
                    JSON.stringify(
                        await ADD_MESSAGE({
                        room: { _id: roomState.previous._id },
                        user: null,
                        content: CREATE_MESSAGE_CONTENT(roomState, socket.id),
                        admin: true
                    })
                ));
            }
        }catch (err) {
            console.log("Err Disconnected", err)
        }

    });

    /** Join User in Room */
    socket.on('userJoined', (data) => {
        currentRoomId = data.room._id;
        data.socketId = socket.id;
        socket.join(data)
        JOIN_ROOM(socket, data);
    });

    /** User Exit Room */
    socket.on('exitRoom', data => {
        currentRoomId = null;
        socket.leave(data.room._id, async () => {
            socket.to(data.room._id).emit(
                'updateRoomData',
                JSON.stringify({
                    room: data.room
                })
            );

            /** Update room list count */
            socket.broadcast.emit(
                'updateRooms',
                JSON.stringify({
                    room: await GET_ROOMS()
                })
            );

            io.to(data.room._id).emit('receivedUserExit', data.room);

            /** Send Exit Message back to room */
            socket.broadcast
                .to(data.room._id)
                .emit('receivedNewMessage', JSON.stringify(await ADD_MESSAGE(data)));
        });
    });

    /** User Typing Events */
    socket.on('userTyping', data => {
        if (!userTypings[data.room._id]) {
            userTypings[data.room._id] = [];
        } else {
            if (!userTypings[data.room._id].includes(data.user.handle)) {
                userTypings[data.room._id].push(data.user.handle);
            }
        }

        socket.broadcast
            .to(data.room._id)
            .emit('receivedUserTyping', JSON.stringify(userTypings[data.room._id]));
    });

    socket.on('removeUserTyping', data => {
        if (userTypings[data.room._id]) {
            if (userTypings[data.room._id].includes(data.user.handle)) {
                userTypings[data.room._id] = userTypings[data.room._id].filter(
                    handle => handle !== data.user.handle
                );
            }
        }

        socket.broadcast.to(data.room._id).emit('receivedUserTyping', JSON.stringify(userTypings[data.room._id]));
    });

    /** New Message Event */
    socket.on('newMessage', async data => {
        try {
            const newMessage = await ADD_MESSAGE(data);
            // Emit data back to the client for display
            console.log("New Message Io", newMessage)
            socket.broadcast.to(data.room._id).emit('receivedNewMessage', JSON.stringify(newMessage));
        }catch (err) {
            console.log("New Mess", err)
        }

    });

    /** Room Deleted Event */
    socket.on('roomDeleted', async data => {
        io.to(data.room._id).emit('receivedNewMessage', JSON.stringify(data));
        io.to(data.room._id).emit('roomDeleted', JSON.stringify(data));
        io.emit('roomListUpdated', JSON.stringify(data));
    });

    /** Room Added Event */
    socket.on('roomAdded', async data => {
        io.emit('roomAdded', JSON.stringify(data));
    });

    /** Room Updated Event */
    socket.on('roomUpdateEvent', async data => {
        io.in(data.room._id).emit('roomUpdated', JSON.stringify(data));
        io.emit('roomNameUpdated', JSON.stringify(data));
    });

    /** Reconnected: Update Reconnected User in Room */
    socket.on('reconnectUser', data => {
        currentRoomId = data.room._id;
        data.socketId = socket.id;
        if (socket.handshake.headers.referer.split('/').includes('room')) {
            try {
                socket.join(currentRoomId);
                socket.emit('reconnected');
                UPDATE_ROOM_USERS(data);
            } catch (error) {
                console.error('Error while rejoining room:', error);
            }
        }
    //     currentRoomId = data.room._id;
    //     data.socketId = socket.id;
    //     const refer = socket.handshake.headers.referer.split('/').includes('room')
    //     console.log("Refer", refer)
    //     if (refer) {
    //         socket.join(currentRoomId, async () => {
    //             socket.emit('reconnected');
    //             await UPDATE_ROOM_USERS(data);
    //         });
    //     }
    });
});

httpServer.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port", `${process.env.PORT} 🍬`)

})


module.exports = {app}
