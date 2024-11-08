import bcrypt from 'bcrypt';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true, length: 10 })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ length: 1000 })
  biography: string;

  @Column()
  createdAt: string;

  @Column({ nullable: true })
  updatedAt: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.0 })
  balance: number;

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
    user.balance = 10.0;

    return user;
  }
}
