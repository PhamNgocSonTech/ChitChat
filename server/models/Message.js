const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: {
        type: String,
        require: true,
        trim: true,
    },
    room: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Room'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    admin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: {
            createdAt: 'createAt',
            updatedAt: 'updatedAt'
        }
    }
)
const Message = mongoose.model('Message', MessageSchema);
module.exports = {Message}