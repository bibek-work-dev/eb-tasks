import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnvVariables } from "../config/genEnvVariables";
import { ConflictError, UnauthorizedError } from "../utils/ErrorHandler";
import { typeJwtPayload } from "../types/jwt";
import JtiModel from "../models/jti.model";

// export interface typeJwtPayload {
//   userId: string;
//   email: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: typeJwtPayload;
//     }
//   }
// }

const JWT_SECRET = getEnvVariables().JWT_SECRET;

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeaders = req.headers.authorization;
    // console.log("authHeaders", authHeaders);
    if (!authHeaders) {
      throw new UnauthorizedError("No authentication Header at all");
    }
    const bearerToken = authHeaders.split(" ");
    const token = bearerToken[1];
    // console.log("token in reuireAuth", token);
    if (bearerToken[1] !== "Bearer")
      if (!token) throw new UnauthorizedError("Not authorized at all");
    const decodedToken = <typeJwtPayload>await jwt.verify(token, JWT_SECRET);
    // console.log("decodedToken", decodedToken);
    if (!decodedToken) {
      throw new UnauthorizedError("Not authorized at all");
    }

    const { jti } = decodedToken;
    const doesJtiExists = await JtiModel.findOne({ jti });

    if (!doesJtiExists)
      throw new ConflictError("You can't use the same token after logged out");

    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.log("error in requireAuth middleware", error);
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expired"));
    }
    if (error.name === "NotBeforeError") {
      return next(new UnauthorizedError("Token not active yet"));
    }
    next(error);
  }
}
