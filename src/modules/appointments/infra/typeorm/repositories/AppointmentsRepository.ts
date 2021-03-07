import { getRepository, Repository, Raw} from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

import Appointment from '../entities/Appointment';
import User from '@modules/users/infra/typeorm/entities/User';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;
    
    private ormUserRepository: Repository<User>;  // alteracao

    constructor() {
        this.ormRepository = getRepository(Appointment);
        this.ormUserRepository = getRepository(User);
    }

    public async findByProviderId(provider_id: String): Promise<User | undefined> {
        const provider = await this.ormUserRepository.findOne({
            where : { id: provider_id }
        });

        return provider; 
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        return findAppointment;
    }

    // public async findAllInDayFromProvider({
    //     provider_id,
    //     day,
    //     month,
    //     year,
    // }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    //     const parsedDay = String(day).padStart(2,'0');
    //     const parsedMonth = String(month).padStart(2,'0');

    //     const appointments = await this.ormRepository.find({
    //         where: {
    //             provider_id,
    //             date: Raw(
    //                 dateFieldName =>
    //                 `to_char(${dateFieldName},'DD-MM-YYYY' = '${parsedDay}-${parsedMonth}-${year}'`,
    //             ),
    //         },
    //     });
       
    //     return []; appointments; 
    // }

    // public async findAllInMonthFromProvider({
    //     provider_id,
    //     month,
    //     year,
    // }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {

    //     const parsedMonth = String(month).padStart(2,'0');

    //     const appointments = await this.ormRepository.find({
    //         where: {
    //             provider_id,
    //             date: Raw(
    //                 dateFieldName =>
    //                 `to_char(${dateFieldName},'MM-YYYY' = '${parsedMonth}-${year}'`,
    //             ),
    //         },
    //     });
       
    //     return appointments;
    // }

    // Erro acima foi causado pelo simples falta de atenção em 
    // Erro linha 59: `to_char(${dateFieldName},'MM-YYYY' = '${parsedMonth}-${year}'`,
    // Correcao     : `to_char(${dateFieldName},'MM-YYYY') = '${parsedMonth}-${year}'`,
    // Tanto o metodo findAllInDayFrom e findAllInMonthFrom estavam com o mesmo erro. 

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');
    
        const appointments = await this.ormRepository.find({
          where: {
            provider_id,
            date: Raw(
              dateFieldName =>
                `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
            ),
          },
        });
    
        return appointments;
      }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
      }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
    
        const appointments = await this.ormRepository.find({
          where: {
            provider_id,
            date: Raw(
              dateFieldName =>
                `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
            ),
          },
        });
    
        return appointments;
      }


    public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, user_id, date});

        await this.ormRepository.save(appointment);

        return appointment; 
    }
}

export default AppointmentsRepository;
