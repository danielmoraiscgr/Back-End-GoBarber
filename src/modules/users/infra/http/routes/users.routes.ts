import { Router } from 'express';
import multer from 'multer';
import uploadingConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthentication from '../middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const userAvatarControler = new UserAvatarController();
const usersController = new UsersController();

const upload = multer(uploadingConfig);

usersRouter.post('/', celebrate({
    [Segments.BODY] : {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  }),usersController.create);

usersRouter.patch(
    '/avatar',
    ensureAuthentication,
    upload.single('avatar'), userAvatarControler.update);

export default usersRouter;
