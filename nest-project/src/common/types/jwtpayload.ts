import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from './user-role';

export interface AppJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
