import { TokenService } from '../token.service';
import { ExtendedRequest } from 'src/app.module';

export const createContext = (
  req: ExtendedRequest,
  tokenService: TokenService,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return { req };

  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded;
    return { req };
  } catch {
    return { req };
  }
};
