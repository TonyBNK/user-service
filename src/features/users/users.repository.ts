import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = await User.createInstance(userDto);

    await this.dataSource.getRepository(User).save(user);

    return user;
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<boolean> {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(userDto).filter(([, value]) => value),
    );

    const result = await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({ ...fieldsToUpdate, updatedAt: new Date().toISOString() })
      .where('id = :id', { id })
      .execute();

    return Boolean(result.affected);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    return Boolean(result.affected);
  }
}
