import { User } from '../features/users/user.entity';
import { MeViewModel } from '../types/view/me';

export const mapMeToViewModel = (user: User): MeViewModel => ({
  userId: user.id,
  login: user.login,
  email: user.email,
  age: user.age,
  biography: user.biography,
});
