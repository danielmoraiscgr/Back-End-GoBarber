import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

//import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentsService from '@modules/appointments/services/CreateAppointmentService';


export default class AppointmentsController {
  public async create(request: Request, response:Response): Promise<Response>{
    const user_id = request.user.id; 

    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    // const appointmentsRepository = new AppointmentsRepository();
    // const createAppointment = new CreateAppointmentsService(appointmentsRepository);

    // mudança com injectao de dependencia
    const createAppointment = container.resolve(CreateAppointmentsService);

    const appointment = await createAppointment.execute({
        date: parsedDate,
        user_id,
        provider_id,
    });

    return response.json(appointment);

  }
}