const express = require('express');
const validateBody = require('../helpers/validateBody');
const ctrl = require('../helpers/ctrl');
const { schemas } = require('../db/models/User');
const authRouter = express.Router();
authRouter.post('/register', validateBody(schemas.registerSchema));
module.exports = authRouter;
