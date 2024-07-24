const multer = require('multer');
const path = require('node:path');
const HttpError = require('./HttpError');
const temp = path.resolve('temp');
const storage = multer.diskStorage({
  destination: temp,
  filename: (req, file, callback) => {
    const uniqPref = Date.now() + '_' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqPref}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limit = {
  fileSize: 1024 * 1024 * 5,
};
const fileFilter = (req, file, callback) => {
  const exten = file.originalname.split('.').pop();
  if (exten === 'exe') {
    return callback(HttpError(400, '.exe not allowed here'));
  }
  callback(null, true);
};
const upload = multer({
  storage,
  limit,
  fileFilter,
});
module.exports = upload;
