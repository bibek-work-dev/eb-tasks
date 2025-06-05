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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExists = yield user_model_1.default.findOne({ email: data.email });
    if (alreadyExists)
        throw new Error("Email already exists");
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    const { password } = data, rest = __rest(data, ["password"]);
    return user_model_1.default.create(Object.assign(Object.assign({}, rest), { password: hashedPassword }));
});
exports.registerService = registerService;
const loginService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExists = yield user_model_1.default.findOne({ email: data.email });
    if (!alreadyExists)
        throw new Error("User Doesn't Exists");
    const isPasswordValid = yield bcryptjs_1.default.compare(data.password, alreadyExists.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    return alreadyExists;
});
exports.loginService = loginService;
