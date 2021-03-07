import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProvidersMonthAvailabilityService from './ListProvidersMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersMonthAvailability: ListProvidersMonthAvailabilityService;

describe('ListProvidersMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersMonthAvailability = new ListProvidersMonthAvailabilityService(
          fakeAppointmentsRepository
        );
    });
    it('should be able to list the month availability from provider', async () => {
    
        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 11, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: 'user_1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 13, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 16, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 20, 17, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            user_id: '1288f226-1002-4a14-bc05-979ef802f92b',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listProvidersMonthAvailability.execute({
            provider_id: '1288f226-1002-4a14-bc05-979ef802f92a',
            year: 2020,
            month: 5,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ])
        );
    });
});
