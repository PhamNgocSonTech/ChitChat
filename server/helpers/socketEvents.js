const {
    ADD_MESSAGE,
    GET_MESSAGE,
    GET_ROOMS,
    UPDATE_ROOM_USERS,
    GET_ROOM_USERS
} = require('../actions/socketio')

module.exports = {
    JOIN_ROOM:  (socket, data) => {
        socket.join(data.room._id, async () => {
            // Get list of message to send back to client
            socket.emit(
                'updateRoomData',
                JSON.stringify({
                    messages: await GET_MESSAGE(data),
                    room: await UPDATE_ROOM_USERS(data)
                })
            );

            // Get room to update user list for all other client
            socket.broadcast
                .to(data.room._id)
                .emit('updateUserList', JSON.stringify(await GET_ROOM_USERS(data)));
            // Emit event to all clients in the room list
            socket.broadcast.emit(
                'updateRooms',
                JSON.stringify({
                    room: await GET_ROOMS()
                })
            );
            // Emit back the message
            socket.broadcast.to(data.room._id).emit(
                'receivedNewMessage',
                JSON.stringify(
                    await ADD_MESSAGE({
                        room: data.room,
                        user: false,
                        content: data.content,
                        admin: data.admin
                    })
                )
            )
        })
    }
}
