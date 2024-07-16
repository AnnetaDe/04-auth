const { Schema, model } = require('mongoose');
const handleMongooseError = require('../../helpers/handleMongooseError');
const emailRegex = require('../../user-constants');
const Joi = require('joi');
const setMongoUpdateSettings = require('../../helpers/setMongoUpdateSettings');
const userSchema = new Schema(
  {
    username: { type: String, required: [true, 'Password is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegex,
      unique: true,
    },
    password: { type: String, required: true },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(7).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(7).required(),
});
const authSchemas = {
  registerSchema,
  loginSchema,
};
const User = model('user', userSchema);
userSchema.post('save', handleMongooseError);
userSchema.pre('findOneAndUpdate', setMongoUpdateSettings);
