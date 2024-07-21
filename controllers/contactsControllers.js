const ctrl = require('../helpers/ctrl.js');
const HttpError = require('../helpers/HttpError');
const { ContactDB } = require('../db/models/Contacts.js');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 3, favorite, ...filters } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner, ...filters };

  if (favorite) {
    filter.favorite = favorite === 'true';
  }

  const result = await ContactDB.find(filter).skip(skip).limit(limit);
  res.json(result);
};
const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await ContactDB.findById({ _id: id });
  if (!result) {
    throw HttpError(404, 'not found');
  }
  res.json(result);
};
const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await ContactDB.findByIdAndDelete({ _id: id });
};
const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await ContactDB.create({ ...req.body, owner });
  res.json({
    status: 'success',
    code: 201,
    data: { result },
  });
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await ContactDB.updateOne(id, req.param);
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};
const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await ContactDB.findByIdAndUpdate({ _id: id }, req.body, {
    favorite: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};
module.exports = {
  createContact: ctrl(createContact),
  deleteContact: ctrl(deleteContact),
  getAllContacts: ctrl(getAllContacts),
  getOneContact: ctrl(getOneContact),
  updateContact: ctrl(updateContact),
  updateFavorite: ctrl(updateFavorite),
};
