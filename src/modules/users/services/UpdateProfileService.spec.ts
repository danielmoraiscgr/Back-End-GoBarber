import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@exemple.com',
        });

        expect(updateUser.name).toBe('John Trê');
        expect(updateUser.email).toBe('johntre@exemple.com');
    });

    it('should not be able to update the profile from non-existing user', async () => {
        expect(
          updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'Text',
            email: 'teste@example.com',
          }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'johndoe@exemplo.com',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@exemple.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updateUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@exemple.com',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
    
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@exemple.com',
                old_password: 'wrong-old-password',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
