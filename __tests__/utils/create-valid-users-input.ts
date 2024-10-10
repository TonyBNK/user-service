import { CreateUserDto } from '../../src/features/users/dto';

export const createValidUsersInput = (count: number): Array<CreateUserDto> => {
  const result: Array<CreateUserDto> = [];

  for (let i = 0; i < count; i++) {
    result.push({
      login: `User_${i + 1}`,
      email: `example${i + 1}@example.ru`,
      password: '1234567',
      age: Math.floor(Math.random() * 100) + 1,
      biography: '123',
    });
  }

  return result;
};
