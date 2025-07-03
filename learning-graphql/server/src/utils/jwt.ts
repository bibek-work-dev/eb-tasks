import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";
const JWT_EXPIRESIN: any = process.env.JWT_EXPIRESIN || "2h";

console.log("JWT ko chiz haru", JWT_EXPIRESIN, JWT_SECRET);

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRESIN || "2hr" });
}

export function verifyJwt(token: string): any {
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log("user", user);
    return user;
  } catch (error: any) {
    console.log("error", error);
    return null;
  }
}
