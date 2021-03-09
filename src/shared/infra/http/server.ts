import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; 
import routes from './routes';
import uploadingConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';
const cors = require('cors');

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadingConfig.uploadsFolder));
app.use(routes);

app.use(errors()); // retorno Json validação rotas da aplicação.

// tratativa global de erros da aplicação 

app.use((err: Error, request: Request, response: Response, next: NextFunction)=> {
   if (err instanceof AppError){
       return response.status(err.statusCode).json({
           status:'error',
           message: err.message,
       });
   }

   console.error(err);

   return response.status(500).json({
       status: 'error',
       message: 'Internal server error',
   })
})

app.listen(3333, () => {
    console.log('Server started on port 3333');
});
