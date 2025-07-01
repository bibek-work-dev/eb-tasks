import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";
const JWT_EXPIRESIN: any = process.env.JWT_EXPIRESIN || "2h";

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRESIN || "2hr" });
}

export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: any) {
    return null;
  }
}
