const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const passport = require('passport');
const gravatar = require('gravatar');

// MIDDLEWARE VALIDATOR
const {
    createErrorObject,
    // customSocialAuthenticate
} = require ('../middleware/authenticate')

const registerUser =  (req, res) => {
    let errorsArr = [];
    User.findOne({email: req.body.email}).then(user => {
        if(user) {
            errorsArr.push({param: 'email', msg: 'Email is already taken'});
            if(user.username === req.body.username) {
                errorsArr.push({param: 'username', msg: 'Username is already taken'});
            }
            res.send({
                errors: createErrorObject(errorsArr)
            }).end();
        }else{
            const avatar = gravatar.url(req.body.email, {
                s: '220',
                r: 'pg',
                d: 'identicon'
            });
            const newUser = new User({
                handle: req.body.handle,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                image: avatar
            })
            newUser.save().then(userData => {
                const user = _.omit(userData.toObject(), ['password']);
                const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '5m'});
                res.status(200).send({
                    auth: true,
                    token: `Bearer ${token}`,
                    user
                })
            }).catch(err => {
                res.send({
                    err,
                    error: "Something went wrong, Check fields again"
                })
            })
        }
    })
}

const loginUser = async (req, res) => {
    const user = await User.findOne({email: req.body.email}).select('-password');
    if(!user) {
        return res.status(404).send({
            error: 'No User Not Found'
         });
    }
    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {expiresIn: '5m'});

    res.status(200).send({auth: true, token: `Bearer ${token}`, user});
}

const logoutUser = async (req, res) => {
    const user = await User.findOne({username: req.body.username}).select('-password');
    if(!user) {
        return res.status(404).send({
            error: 'Not User Found'
        });
    }
    res.status(200).send({success: true})
}

module.exports =
    {
        registerUser,
        loginUser,
        logoutUser
    }
