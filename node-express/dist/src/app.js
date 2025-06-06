"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// middlewares
app.use(express_1.default.json());
// Routes
app.use("/api/v1/user", user_route_1.default);
// app.use((req, res, next) => {
//   console.log("yeha");
//   next();
// });
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
