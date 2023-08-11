const express = require('express');
const router = express.Router();
const passport = require('passport');
const {checkCreateRoomFields } = require('../middleware/authenticate');
const {} = require('../controllers/roomController');
router.post('/addRoom', [passport.authenticate('jwt', { session: false }), checkCreateRoomFields],);
router.get('/getAllRoom', passport.authenticate('jwt', { session: false }),);
router.get('getRoom/room_id', passport.authenticate('jwt', { session: false }),);
router.post('/verify', passport.authenticate('jwt', { session: false }),);
router.delete('deleteRoom/:room_name', passport.authenticate('jwt', { session: false }),);
router.post('/update/name', passport.authenticate('jwt', { session: false }),);
router.post('/remove/users', passport.authenticate('jwt', { session: false }),);
router.post('/remove/users/:id/all', passport.authenticate('jwt', { session: false }),);


module.exports = router;