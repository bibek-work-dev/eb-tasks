import { JwtPayload } from "jsonwebtoken";

export interface typeJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  jti: string;
}

declare global {
  namespace Express {
    interface Request {
      user: typeJwtPayload;
    }
  }
}
