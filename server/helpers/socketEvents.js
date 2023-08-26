const {
    ADD_MESSAGE,
    GET_MESSAGES,
    UPDATE_ROOM_USERS,
    GET_ROOMS,
    GET_ROOM_USERS
} = require('../actions/socketio');

module.exports = {
    JOIN_ROOM: (socket, data) => {
        socket.join(data.room._id, async () => {

            /** Get list of messages to send back to client */
            const getMessages = await GET_MESSAGES(data)
            const updatedRoom = await UPDATE_ROOM_USERS(data)
            console.log('get message:',getMessages)
            console.log('get update room:',updatedRoom)

            socket.emit(
                'updateRoomData',
                JSON.stringify({
                    messages: await getMessages,
                    room: await updatedRoom
                })
            );

            /** Get Room to update user list for all other clients */
            const getRoomUsers = await GET_ROOM_USERS(data)
            console.log('get room users:',getRoomUsers)

            socket.broadcast
                .to(data.room._id)
                .emit('updateUserList', JSON.stringify(getRoomUsers));

            /** Emit event to all clients in the roomlist view except the sender */
            const getRooms = await GET_ROOMS();
            console.log('get room:',getRooms)
            socket.broadcast.emit('updateRooms', JSON.stringify({
                    room: await getRooms
                })
            );

            /** Emit back the message */
            const addNewMessages = await ADD_MESSAGE({
                room: data.room,
                user: false,
                content: data.content,
                admin: data.admin
            })
            console.log('Add Message',addNewMessages)

            socket.broadcast.to(data.room._id).emit('receivedNewMessage', addNewMessages);
        });
    }
};
