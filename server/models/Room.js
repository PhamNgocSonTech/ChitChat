const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            minLength: ['3', 'Room name should be greater than 3 characters'],
            maxLength: ['10', 'Room name should be less than 10 characters'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: ''
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
            bcrypt.hash(this.password, (err, res) => {
                this.password = res
                next();
            })
        })
    }else{
        next();
    }
})

const Room = mongoose.model('RoomSchema', RoomSchema);
module.exports = {Room}