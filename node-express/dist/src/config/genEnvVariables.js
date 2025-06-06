"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariables = void 0;
const getEnvVariables = () => {
    return {
        MONGO_URI: process.env.MONGO_URI,
        PORT: Number(process.env.PORT),
        APP_PASSWORD: process.env.APP_PASSWORD,
        JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
        JWT_SECRET: process.env.JWT_SECRET,
        NODEMAILER_HOST: process.env.NODEMAILER_HOST,
        NODEMAILER_PORT: Number(process.env.NODEMAILER_HOST),
        NODEMAILER_FROM: process.env.NODEMAILER_FROM,
        NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
    };
};
exports.getEnvVariables = getEnvVariables;
