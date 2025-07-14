import { AppJwtPayload } from './jwtpayload';

export class AuthenticatedRequest extends Request {
  user: AppJwtPayload;
}
