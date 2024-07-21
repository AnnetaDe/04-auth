const express = require('express');
const authentificate = require('../helpers/authentificate.js');

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} = require('../controllers/contactsControllers');

const { schemas } = require('../db/models/Contacts.js');
const validateBody = require('../helpers/validateBody');
const isValidId = require('../helpers/isValidId');

const contactsRouter = express.Router();
contactsRouter.use(authentificate);

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', isValidId, getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post(
  '/',
  validateBody(schemas.createContactSchema),
  createContact
);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(schemas.updateContactSchema),
  updateContact
);
contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  updateFavorite
);

module.exports = contactsRouter;
