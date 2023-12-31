const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        handle: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            maxLength: ['10', 'Username should be less than 10 characters']
        },
        social: {
            id: {
                type: String,
                default: null
            },
            image: {
                type: String,
                default: null,
            },
            email: {
                type: String,
                default: null,
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            sparse: true,
        },
        password: {
            type: String,
            default: null
        },
        image: {
            type: String,
            default: null,
        },
        location: {
            type: String,
            default: null
        }
    },

    {
        timestamps: {
            createdAt: 'createAt',
            updatedAt: 'updateAt'
        }
    }
);

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function (next) {
    if(this.password !== '' && this.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, res) => {
                this.password = res;
                next();
            });
        });
    }else{
        next();
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = {User}