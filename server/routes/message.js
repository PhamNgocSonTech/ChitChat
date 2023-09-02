const express = require('express');
const router = express.Router();
const passport = require('passport');
const {getMessageRoomId, addMessage} = require('../controllers/messageController')

router.get('/:room_id', passport.authenticate('jwt', {session: false}), getMessageRoomId)
router.post('/addMessage', passport.authenticate('jwt', {session: false}), addMessage)

module.exports = router