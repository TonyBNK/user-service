import { UserViewModel } from '../common/types/view/user';
import { User } from '../features/users/user.entity';

export const mapUserToViewModel = (user: User): UserViewModel => ({
  id: user.id,
  login: user.login,
  email: user.email,
  age: user.age,
  biography: user.biography,
  balance: user.balance,
  createdAt: user.createdAt,
});
