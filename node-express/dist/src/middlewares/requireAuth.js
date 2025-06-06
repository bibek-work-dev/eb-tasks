"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genEnvVariables_1 = require("../config/genEnvVariables");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const JWT_SECRET = (0, genEnvVariables_1.getEnvVariables)().JWT_SECRET;
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeaders = req.headers.authorization;
            if (!authHeaders) {
                throw new ErrorHandler_1.UnauthorizedError("No authentication Header at all");
            }
            const bearerToken = authHeaders.split(" ");
            const token = bearerToken[1];
            if (bearerToken[1] !== "Bearer")
                if (!token)
                    throw new ErrorHandler_1.UnauthorizedError("Not authorized at all");
            const decodedToken = yield jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = decodedToken;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
