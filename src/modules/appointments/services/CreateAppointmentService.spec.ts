import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository(); 
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce( () =>{
            return new Date(2020, 4, 10, 12).getTime();
        });
        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '111111',
            provider_id: '123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    it('should not be able create a two appointment on the same time', async () => {
        const appointmentDate = new Date(2021, 3, 7, 12);   

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '111111',
            provider_id: '123123',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '111111',
                provider_id: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

  
    it('should not be able to create an appointments on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce( () =>{
            return new Date(2021, 2, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 2, 10, 11),
                user_id: '111111',
                provider_id: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce( () =>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'user-id',
                provider_id: 'user-id',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able create an appointment before 8am and after 5pm.', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce( () =>{
            return new Date(2021, 2, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 2, 10, 7),
                user_id: 'user-id',
                provider_id: 'provider-id',
            })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2021, 2, 10, 18),
                user_id: 'user-id',
                provider_id: 'provider-id',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

});
