const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minLength: ['3', 'Room name should be greater than 3 characters'],
            maxLength: ['10', 'Room name should be less than 10 characters'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        password: {
            type: String,
            default: '',
        },

        access: {
            type: Boolean,
            default: true,
        },

        accessIds: {
            type: Array,
            default: [],
        },

        users: [
            {
                _id: false,
                lookup: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                sockedId: {
                    type: String,
                    required: true
                }
            }
        ]
    },

    {
        timestamps:{
            createdAt: 'createAt',
            updatedAt: 'updateAt'
        }
    }
)

RoomSchema.methods.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password)
}

RoomSchema.pre('save', function (next) {
    if(this.password !== '' && this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, res) => {
                this.password = res
                next();
            })
        })
    }else{
        next();
    }
})

const Room = mongoose.model('Room', RoomSchema);
module.exports = {Room}