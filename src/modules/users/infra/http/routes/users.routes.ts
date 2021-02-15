import { Router } from 'express';
import multer from 'multer';
import uploadingConfig from '@config/upload';

import ensureAuthentication from '../middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const userAvatarControler = new UserAvatarController();
const usersController = new UsersController();

const upload = multer(uploadingConfig);

usersRouter.post('/', usersController.create);

usersRouter.patch(
    '/avatar',
    ensureAuthentication,
    upload.single('avatar'), userAvatarControler.update);

export default usersRouter;
