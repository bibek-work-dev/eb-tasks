import { JwtPayload } from "jsonwebtoken";

export interface typeJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: typeJwtPayload;
    }
  }
}
