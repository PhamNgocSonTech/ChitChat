const {User} = require('../models/User');


const getAllUsers =  async(req, res) => {
    const users = await User.find({}, 'image email username location').exec();
    if(users) {
        return res.status(200).json(users).end();
    }else{
        return res.status(404).json({error: 'No User Not Found'})
    }
}

const updateUser = async (req, res) => {
    const updateField = {};
    for(let key of Object.keys(req.body)){
        if(req.body[key] !== null){
            updateField[key] = req.body[key];
        }
    }
    await User.findOneAndUpdate({_id: req.user.id}, {$set: updateField}, {new: true})
        .select('-password')
        .then(doc => res.json({success: true, user: doc}))
        .catch(err => res.json({error: err}))
}

const getCurrentUser = (req, res) => {
    return res.json(req.user)
}

const deleteCurrentUser = async (req, res) => {
    await User.findByIdAndDelete({_id: req.user.id})
    res.json({success: true})
}


module.exports = {getAllUsers, updateUser, getCurrentUser, deleteCurrentUser}