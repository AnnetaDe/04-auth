const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const gravatar = require('gravatar');

const { User } = require('../db/models/User');

const HttpError = require('../helpers/HttpError');
const ctrl = require('../helpers/ctrl');
const path = require('path');
const fs = require('fs/promises');
const cloudinary = require('../helpers/cloudinary');
const upload = require('../helpers/upload');
const Jimp = require('jimp');

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
  });
  res.status(201).json({
    name: newUser.username,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
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

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '17d' });
  await User.findByIdAndUpdate(user._id, { token, refreshToken });

  res.json({
    token,
    refreshToken,
  });
};

const current = async (req, res) => {
  const { email, username, subscription } = req.user;
  res.json({
    message: `You logged in as ${username}`,
    email,
    subscription,
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const payload = { id };
    const acccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '17d' });

    res.json({
      acccessToken,
      refreshToken,
    });
  } catch (error) {
    next(HttpError(403, 'Refresh token invalid'));
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  if (!user.refreshToken) {
    throw HttpError(403, 'User already signed out');
  }
  await User.findByIdAndUpdate(_id, { token: '', refreshToken: '' });

  res.json({
    message: 'Logout successesfully',
  });
};
const pathAvatar = path.resolve('public', 'avatars');

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const img = await Jimp.read(req.file.path);
    img.resize(250, 250).write(req.file.path);
    const { path: temp, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    const avatarUrl = path.join(pathAvatar, filename);
    await fs.rename(temp, avatarUrl);
    const fileData = await cloudinary.uploader.upload(avatarUrl, {
      folder: 'avatars',
      public_id: 'av',
    });
    const cloudUrl = fileData.url;

    await User.findByIdAndUpdate(_id, { avatarUrl, cloudUrl });
    res.json({
      avatarUrl,
    });
  } catch (err) {
    throw err;
  }
};

const updateUserData = async (req, res) => {
  console.log(req.file);
  try {
    const { _id } = req.user;
    const updates = req.body;
    if (
      updates.subscription &&
      !['starter', 'pro', 'business'].includes(updates.subscription)
    ) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    if (updates.avatarUrl) {
    }
    const user = await User.findByIdAndUpdate(_id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register: ctrl(register),
  login: ctrl(login),
  current: ctrl(current),
  refresh: ctrl(refresh),
  logout: ctrl(logout),
  updateUserData: ctrl(updateUserData),
  updateAvatar: ctrl(updateAvatar),
};
