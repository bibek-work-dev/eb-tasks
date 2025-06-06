interface typeEnvironmentVarialbes {
  MONGO_URI: string;
  PORT: number;
  APP_PASSWORD: string;
}

const getEnvVariables = (): typeEnvironmentVarialbes => {
  return {
    MONGO_URI: <string>process.env.MONGO_URI,
    PORT: Number(process.env.PORT) as number,
    APP_PASSWORD: <string>process.env.APP_PASSWORD,
  };
};
