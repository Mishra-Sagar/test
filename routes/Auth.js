const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/testRoute', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'here is your profile',
  });
});

module.exports = router;
