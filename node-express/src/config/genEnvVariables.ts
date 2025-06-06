interface typeEnvironmentVarialbes {
  MONGO_URI: string;
  PORT: number;
  APP_PASSWORD: string;
  JWT_EXPIRESIN: string;
  JWT_SECRET: string;
  NODEMAILER_HOST: string;
  NODEMAILER_PORT: number;
  NODEMAILER_FROM: string;
  NODEMAILER_SERVICE: string;
}

export const getEnvVariables = (): typeEnvironmentVarialbes => {
  return {
    MONGO_URI: <string>process.env.MONGO_URI,
    PORT: Number(process.env.PORT) as number,
    APP_PASSWORD: <string>process.env.APP_PASSWORD,
    JWT_EXPIRESIN: <string>process.env.JWT_EXPIRESIN,
    JWT_SECRET: <string>process.env.JWT_SECRET,
    NODEMAILER_HOST: <string>process.env.NODEMAILER_HOST,
    NODEMAILER_PORT: <number>Number(process.env.NODEMAILER_HOST),
    NODEMAILER_FROM: <string>process.env.NODEMAILER_FROM,
    NODEMAILER_SERVICE: <string>process.env.NODEMAILER_SERVICE,
  };
};
