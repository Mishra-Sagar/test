const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = '12345678';

async function register(req, res, next) {
  let { name, username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Please provide both, username and password',
    });
  }

  const user = await User.findOne({ username: username });

  if (user) {
    return res.status(400).json({
      message: 'User already present with supplied username',
    });
  } else {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('hex');

    const newUser = await User.create({
      name,
      username,
      password: hash,
    });

    res.status(200).json({
      message: 'User registered successfully',
    });
  }
}

async function login(req, res, next) {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Please provide both, username and password',
    });
  }
  const hash = crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex');

  const user = await User.findOne({ username: username, password: hash });

  if (!user) {
    return res.status(403).json({
      message: 'Incorrect username or password',
    });
  } else {
    let token = jwt.sign({ name: user.name }, 'secretvalue', {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  }
}

module.exports.register = register;
module.exports.login = login;
