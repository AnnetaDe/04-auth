const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CLOUDINARY_NAME, CLODINARY_API_KEY, CLODINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLODINARY_API_KEY,
  api_secret: CLODINARY_API_SECRET,
});

module.exports = cloudinary;
