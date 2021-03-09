import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(
          fakeAppointmentsRepository
        );
    });
    it('should be able to list the appointments on a specific day', async () => {
    
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user',
            date: new Date(2021, 2, 10, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
          provider_id: 'provider_id',
          user_id: 'user',
          date: new Date(2021, 2, 10, 15, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
           provider_id: 'provider_id',
           year: 2021, 
           month: 3,
           day: 10,
        });

        expect(appointments).toEqual([
          appointment1,
          appointment2,
        ])


        
    });
});
