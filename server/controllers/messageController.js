const {createErrorObject} = require('../middleware/authenticate')
const {Message} = require('../models/Message');


const getMessageRoomId = async(req, res) => {
    const message = await Message.find({room: req.params.room_id});
    if(message) {
        return res.status(200).json(message)
    }else{
        return res.status(404).json({error: 'No Message Found'})

    }
}

const addMessage = async(req, res) => {
    let errorsArr = [];
    if(!req.body.content) {
        errorsArr.push({param: 'No_Content', msg: 'Message Can Not Empty'});
        return res.json({errors: createErrorObject(errorsArr)})
    }
    const newMessage = new Message({
        content: req.body.content,
        admin: req.body.admin ? true : false,
        user: req.user.id,
        room: req.body.roomId
    }).save()
    return res.status(200).json(newMessage)
}

module.exports = {
    getMessageRoomId,
    addMessage
}