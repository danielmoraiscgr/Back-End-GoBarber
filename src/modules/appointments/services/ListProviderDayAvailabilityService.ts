import { injectable, inject } from 'tsyringe';
import { getHours, getDate, getDaysInMonth, isAfter } from 'date-fns'
import { isUuid } from 'uuidv4';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
   hour: number; 
   available: boolean;
}>

@injectable()
class ListProvidersDayAvailabilityService {
    constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,       
    ) {}

    public async execute({
        provider_id, day, year, month
    }: IRequest): Promise<IResponse> {

      if (!isUuid(provider_id) ){
        throw new AppError('Id Provider is not uuid !');
      }
      
      const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id, 
        year, 
        month,
        day, 
      });

      // verificar se o ID do provedor é existente no banco

      const checkProvider = await this.appointmentsRepository.findByProviderId(provider_id);


      if (!checkProvider) {
        throw new AppError('Provider does not exist !');
      }

      const hourStart = 8; 

      const eachHourArray = Array.from({ length: 10 }, (_, index)=> index + hourStart,);

      const currentDate = new Date(Date.now());

      const availability = eachHourArray.map( hour => {
        const hasAppointmentInHour = appointments.find(appointment=>
          getHours(appointment.date) === hour,)

        
        const compareDate = new Date(year, month-1, day, hour);

        return {
          hour,
          available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
        }
      });

    return availability;
  }
}

export default ListProvidersDayAvailabilityService;
