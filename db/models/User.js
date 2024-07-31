const { Schema, model } = require('mongoose');
const handleMongooseError = require('../../helpers/handleMongooseError');
const emailRegex = require('../../user-constants');
const Joi = require('joi');
const setMongoUpdateSettings = require('../../helpers/setMongoUpdateSettings');
const userSchema = new Schema(
  {
    username: { type: String, required: [true, 'Username is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegex,
      unique: true,
    },
    password: { type: String, required: true },
    avatarUrl: {
      type: String,
      default: '',
    },
    cloudUrl: {
      type: String,
      default: '',
    },

    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
    verificationCode: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(7).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(7).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required,
});
const authEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const authSchemas = {
  registerSchema,
  loginSchema,
  refreshSchema,
  authEmailSchema,
};
const User = model('user', userSchema);
module.exports = {
  User,
  authSchemas,
};
