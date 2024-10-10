import bcrypt from 'bcrypt';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column()
  biography: string;

  @Column()
  createdAt: string;

  static async createInstance({
    login,
    email,
    password,
    age,
    biography,
  }: CreateUserDto): Promise<User> {
    const id = v4();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User();
    user.id = id;
    user.email = email;
    user.login = login;
    user.password = passwordHash;
    user.age = age;
    user.biography = biography;
    user.createdAt = new Date().toISOString();

    return user;
  }
}
