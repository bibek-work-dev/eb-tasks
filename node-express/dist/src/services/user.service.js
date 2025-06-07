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
exports.resetPasswordService = exports.forgotPasswordService = exports.changePasswordService = exports.logoutService = exports.updateProfileService = exports.getMeService = exports.verifyEmailService = exports.loginService = exports.registerService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const sendEmail_1 = require("../utils/emails/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genEnvVariables_1 = require("../config/genEnvVariables");
const JWT_SECRET = (0, genEnvVariables_1.getEnvVariables)().JWT_SECRET;
const getRandomNumber = () => {
    return Math.floor(Math.random() * 1000000).toString();
};
const getDateFifteenMinutesFromNow = () => {
    return new Date(Date.now() + 15 * 60 * 1000);
};
const registerService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExists = yield user_model_1.default.findOne({ email: data.email });
    if (alreadyExists)
        throw new ErrorHandler_1.BadRequestError("Email already exists");
    console.log("register service");
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    const { password } = data, rest = __rest(data, ["password"]);
    const verificationToken = getRandomNumber();
    yield (0, sendEmail_1.sendVerficationEmail)(data.email, verificationToken);
    return user_model_1.default.create(Object.assign(Object.assign({}, rest), { password: hashedPassword, verificationToken, verficationDate: getDateFifteenMinutesFromNow() }));
});
exports.registerService = registerService;
const loginService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExists = yield user_model_1.default.findOne({ email: data.email });
    console.log("login service");
    if (!alreadyExists)
        throw new ErrorHandler_1.UnauthorizedError("User doesn't exist");
    if (alreadyExists.status != "Active") {
        throw new ErrorHandler_1.ForbiddenError("You aren't verified");
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(data.password, alreadyExists.password);
    if (!isPasswordValid) {
        throw new ErrorHandler_1.BadRequestError("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: alreadyExists._id.toString(),
        email: alreadyExists.email.toString(),
    }, JWT_SECRET, { expiresIn: "1h" });
    return { token, user: alreadyExists };
});
exports.loginService = loginService;
const verifyEmailService = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ErrorHandler_1.NotFoundError("No such user exists");
    }
    if (user.verificationToken !== code) {
        throw new ErrorHandler_1.UnauthorizedError("Invalid verification code.");
    }
    console.log(typeof user.verficationDate);
    const currDate = new Date();
    console.log(typeof currDate);
    if (user.verficationDate && user.verficationDate < currDate) {
        throw new ErrorHandler_1.BadRequestError("Verification token has expired. Please request a new one.");
    }
    if (user.status === "Active") {
        throw new ErrorHandler_1.BadRequestError("User is already verified.");
    }
    user.status = "Active";
    user.verificationToken = undefined;
    user.verficationDate = undefined;
    yield user.save();
});
exports.verifyEmailService = verifyEmailService;
const getMeService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user)
        throw new ErrorHandler_1.NotFoundError("User not found");
    return user;
});
exports.getMeService = getMeService;
const updateProfileService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, data, { new: true });
    return updatedUser;
});
exports.updateProfileService = updateProfileService;
const logoutService = () => __awaiter(void 0, void 0, void 0, function* () {
    // client le garxa afai remove
    return true;
});
exports.logoutService = logoutService;
const changePasswordService = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const updatePassword = yield user_model_1.default.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    return updatePassword;
});
exports.changePasswordService = changePasswordService;
const forgotPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user)
        throw new ErrorHandler_1.NotFoundError("No such user found");
    const resetToken = getRandomNumber();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresIn = getDateFifteenMinutesFromNow();
    yield user.save();
    yield (0, sendEmail_1.sendResetPasswordEmail)(email, resetToken);
    return true;
});
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = (newPassword, confirmPassword, code, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        resetPasswordToken: code,
        _id: userId,
    });
    if (!user)
        throw new Error("No such user found");
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user_model_1.default.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    return true;
});
exports.resetPasswordService = resetPasswordService;
