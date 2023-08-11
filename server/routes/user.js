const express = require('express');
const router = express.Router();

const passport = require('passport');
const {checkEditProfileFields} = require('../middleware/authenticate')
const {
    getAllUsers,
    updateUser,
    getCurrentUser,
    deleteCurrentUser
} = require('../controllers/userController')

router.get('/getAllUsers', passport.authenticate('jwt', { session: false }),  getAllUsers)
router.put('/updateUser', [passport.authenticate('jwt', { session: false }), checkEditProfileFields], updateUser)
router.get('/getUser', passport.authenticate('jwt', { session: false }), getCurrentUser)
router.delete('/deleteUser', passport.authenticate('jwt', { session: false }), deleteCurrentUser)

module.exports = router;