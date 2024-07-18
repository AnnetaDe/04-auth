const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../db/models/User');

const HttpError = require('../helpers/HttpError');
const ctrl = require('../helpers/ctrl');

// const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  // const user = await User.findOne({ email });

  // if (user) {
  //   throw HttpError(409, 'Email already in use');
  // }

  // const hashPassword = await bcrypt.hash(password, 10);
  // const newUser = await User.create({ ...req.body, password: hashPassword });
  const newUser = await User.create({ ...req.body });
  res.status(201).json({
    name: newUser.username,

    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  res.json({
    token,
  });
};

module.exports = {
  register: ctrl(register),
  login: ctrl(login),
};
