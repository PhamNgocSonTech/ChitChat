const express = require('express');
const router = express.Router();
const passport = require('passport');
const {checkCreateRoomFields, checkRegistrationFields} = require('../middleware/authenticate');
const {
    getAllRoom,
    getRoomId,
    addRoom,
    verify,
    deleteRoom,
    updateRoom,
    removeRoom,
    removeAllRoom
} = require('../controllers/roomController');

router.post('/addRoom', [passport.authenticate('jwt', { session: false }), checkRegistrationFields], addRoom);
router.post('/verify', passport.authenticate('jwt', { session: false }), verify);
router.post('/update/name', passport.authenticate('jwt', { session: false }), updateRoom);
router.post('/remove/users', passport.authenticate('jwt', { session: false }), removeRoom);
router.get('/getAllRoom', passport.authenticate('jwt', { session: false }), getAllRoom);
router.get('/getRoom/:room_id', passport.authenticate('jwt', { session: false }), getRoomId);
router.delete('/deleteRoom/:room_name', passport.authenticate('jwt', { session: false }), deleteRoom);
router.put('/remove/users/:id/all', passport.authenticate('jwt', { session: false }), removeAllRoom);

module.exports = router;