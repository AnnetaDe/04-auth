const express = require('express');
const validateBody = require('../helpers/validateBody');
const controller = require('../controllers/authControllers');
const { authSchemas } = require('../db/models/User');
const authRouter = express.Router();
authRouter.post(
  '/register',
  validateBody(authSchemas.registerSchema),
  controller.register
);
module.exports = authRouter;
