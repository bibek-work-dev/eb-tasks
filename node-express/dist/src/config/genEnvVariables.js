"use strict";
const getEnvVariables = () => {
    return {
        MONGO_URI: process.env.MONGO_URI,
        PORT: Number(process.env.PORT),
        APP_PASSWORD: process.env.APP_PASSWORD,
    };
};
