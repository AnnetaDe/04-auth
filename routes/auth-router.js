const express = require('express');
const validateBody = require('../helpers/validateBody');
const authentificate = require('../helpers/authentificate');
const controller = require('../controllers/authControllers');
const { authSchemas } = require('../db/models/User');
const upload = require('../helpers/upload');
const authRouter = express.Router();
authRouter.post(
  '/register',
  validateBody(authSchemas.registerSchema),
  controller.register
);
authRouter.post(
  '/login',
  validateBody(authSchemas.loginSchema),
  controller.login
);

authRouter.post(
  '/verify',
  validateBody(authSchemas.authEmailSchema),
  controller.resendVerify
);
authRouter.get('/current', authentificate, controller.current);
authRouter.get('/verify/:verificationCode', controller.verify);
authRouter.post(
  '/refresh',
  validateBody(authSchemas.refreshSchema),
  controller.refresh
);
authRouter.patch('/update-user', authentificate, controller.updateUserData);
authRouter.patch(
  '/users/avatars',
  upload.single('avatarUrl'),
  authentificate,
  controller.updateAvatar
);

authRouter.post('/logout', authentificate, controller.logout);
module.exports = authRouter;
