import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';
import User from '@modules/users/infra/typeorm/entities/User';

class AppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];
    private users: User[] = []; // alteracao

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find((appointment) =>
            isEqual(appointment.date, date)
        );

        return findAppointment;
    }

    public async findByProviderId(provider_id: String): Promise<User | undefined> {
        const provider = await this.users.find((user) => user.id === provider_id)

        return provider; 
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id && 
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year);

        return appointments;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id && 
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year);

        return appointments;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

        // Abaixo mesma aplicabilidade com o Object.assign

        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
