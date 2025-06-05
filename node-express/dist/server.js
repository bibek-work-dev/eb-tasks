"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const connectDb_1 = __importDefault(require("./src/utils/connectDb"));
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URI ? process.env.MONGO_URI : "";
(0, connectDb_1.default)(dbUrl)
    .then(() => {
    const server = app_1.default.listen(PORT, () => {
        console.log(`Server is listening in PORT ${PORT} `);
    });
    process.on("uncaughtException", () => {
        console.log("error happened");
        process.exit(1);
    });
    process.on("unhandledRejection", () => {
        console.log("unhandled rejection");
        process.exit(1);
    });
})
    .catch((error) => {
    console.log("Something went wrong");
});
