const express = require('express');
const router = express.Router();
const passport = require('passport');
const { profileUser} = require('../controllers/profileController')

router.get('/:handle', passport.authenticate('jwt', { session: false }), profileUser)

module.exports = router