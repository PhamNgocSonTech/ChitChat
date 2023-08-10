const express = require('express');
const router = express.Router();
const {
    checkRegistrationFields,
    checkLoginFields,
    createErrorObject,
    // customSocialAuthenticate
} = require ('../middleware/authenticate')

const {
    registerUser,
    loginUser,
    logoutUser
} = require('../controllers/authController')

router.post('/register', [checkRegistrationFields], registerUser)
router.post('/login', checkLoginFields, loginUser)
router.post('/logout', logoutUser)

module.exports = router;