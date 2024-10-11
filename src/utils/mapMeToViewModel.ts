import { MeViewModel } from '../common/types/view/me';
import { User } from '../features/users/user.entity';

export const mapMeToViewModel = (user: User): MeViewModel => ({
  userId: user.id,
  login: user.login,
  email: user.email,
  age: user.age,
  biography: user.biography,
});
