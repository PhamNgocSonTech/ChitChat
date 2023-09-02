const {User} = require('../models/User')

const profileUser = async(req, res) => {
    const user = await User.findOne({handle: req.params.handle})
        .select('-password -session_id')
        .exec();
    if(user){
        return res
            .status(200)
            .json(user)
            .end()
    }else{
        return res
            .status(404)
            .json({error: `No User Found called ${req.params.username}`})
            .end()
    }
}

module.exports = {profileUser}