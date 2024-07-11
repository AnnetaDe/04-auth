const Joi = require('joi');
const { Schema, model } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  favorite: { type: Boolean, default: false },
});
contactSchema.post('save', handleMongooseError);
const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
const schemas = {
  createContactSchema,
  updateFavoriteSchema,
  updateContactSchema,
};
const ContactDB = model('contact', contactSchema);
module.exports = { ContactDB, schemas };
