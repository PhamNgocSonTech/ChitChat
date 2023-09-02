const {Room} = require('../models/Room');
const {populate} = require("dotenv");
const {createErrorObject} = require("../middleware/authenticate");
const {validationResult, check} = require("express-validator");

const getAllRoom = async(req, res) => {
    const rooms = await Room.find({})
        .populate('user', ['handle'])
        .populate('users.lookup', ['handle'])
        .select('-password')
        .exec();
    if(rooms) {
        return res.status(200).json(rooms);
    }else{
        return res.status(404).json({error: 'No Room Found'})
    }
}

const getRoomId = async(req, res) => {
    const room = await Room.findById(req.params.room_id)
        .populate('user', ['username', 'social', 'image', 'handle'])
        .populate('users.lookup', ['username', 'social', 'image', 'handle'])
        .exec();
    if(room) {
        return res.status(200).json(room);
    }else {
        return res.status(404).json({error: `No Room Found With Name ${req.params.room_name}` })
    }
}

const addRoom = async(req, res) => {
    let errors = [];

    const room = await Room.findOne({name: req.body.room_name}).exec();
    if(room) {
        if(room.name === req.body.room_name) {
            errors.push({param: 'room_taken', msg: 'Room Already Taken'})
            console.log(errors)
        }
            return res.json({errors: createErrorObject(errors)})
    }else{
       const newRoom = new Room({
           name: req.body.room_name,
           user: req.user.id,
           access: req.body.password ? false : true,
           password: req.body.password
       })
            if(newRoom.access === false) {
            newRoom.accessIds.push(req.user.id)
        }
            newRoom.save()
                .then(room => {
                    // no longer accepts a callback as the last argument

                    // Room.populate(room, {path: 'user', select: 'username'}, (err, room) => {
                    //     if(err) {
                    //         console.log(err)
                    //     }
                    //     return res.status(200).json(room)
                    // })

                    Room.populate(room, {path: 'user', select: 'username'})
                        .then(room => {
                            return res.status(200).json(room)
                        })
                })
                .catch(err => {
                    return res.json(err)
                })
        }
}

const verify = async (req, res) => {
    if(!req.body.password === true) {
        return res.json({
            errors: createErrorObject([
                {
                    param: 'password_required',
                    msg: 'password is required'
                }
            ])
        })
    }
    const room = await Room.findOne({name: req.body.room_name}).exec();
    if(room) {
        const verified = await room.isValidPassword(req.body.password);
        if(verified === true) {
            room.accessIds.push(req.user.id);
            await room.save();
            return res.status(200).json({success: true})
        }else{
            return res.json({
                errors: createErrorObject([
                    {
                        param: 'invalid_password',
                        msg: 'Invalid Password '
                    }
                ])
            })
        }
    }else{
        return res.status(404).json({errors:`No room found with name is: ${req.body.room_name}`})
    }
}

const deleteRoom = async(req, res) => {
    try {
        const room = await Room.findOneAndDelete({ name: req.params.room_name })
            .populate('user', ['username'])
            .select('-password')
            .lean();

        if (room) {
            return res.status(200).json(room);
        } else {
            return res.status(404).json({
                errors: `No room with name ${req.params.room_name} found, You will now be redirected`
            });
        }
    } catch (err) {
        return res.status(404).json(err);
    }
}

const updateRoom = async(req, res) => {
    await check('new_room_name')
        .isString()
        .isLength({min: 3, max: 20})
        .withMessage('New Room Name must be between 3 and 20 characters')
    let errors = validationResult(req).array()
    if(errors.length > 0) {
        return res.send({
            errors: createErrorObject(errors)
        })
    }
    const room = await Room.findOneAndUpdate(
        {name: req.body.room_name},
        {name: req.body.new_room_name},
        {fields: {password: 0}, new: true}
    )
        .populate('user', ['username'])
        .populate('users.lookup', ['username'])
    if(room) {
        return res.status(200).json(room);
    }else{
        return res.status(404).json({errors: `No room found with name ${req.params.room_name}`})
    }
}

const removeRoom = async(req, res) => {
    const room = await Room.findOne({name: req.body.room_name});
    if(room) {
        if(room.users.find(user => user.lookup.toString() === req.user.id)) {
           room.users = room.users.filter(user => user.lookup.toString() !== req.user.id);
            await room.save();
        }
        const returnRoom = await Room.populate(room, {
            path: 'user users.lookup',
            select: 'username social image handle'
        })
        return res.status(200).json(returnRoom)
    }

}

const removeAllRoom = async(req, res) => {
    await Room.updateMany({$pull: {users: {$in: [req.body.user_id]}}})
    const rooms = await Room.find({})
        .populate('user', ['username'])
        .populate('users.lookup', ['username'])
        .select('-password')
        .exec();
    if(rooms) {
        return res.status(200).json(rooms);
    }else{
        return res.status(404).json({error: 'No rooms found'})
    }
}


module.exports = {
    getAllRoom,
    getRoomId,
    addRoom,
    verify,
    deleteRoom,
    updateRoom,
    removeRoom,
    removeAllRoom
}