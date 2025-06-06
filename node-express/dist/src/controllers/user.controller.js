"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.resetPasswordController = exports.forgotPasswordController = exports.changePasswordController = exports.updateProfileController = exports.getMeController = exports.verifyEmailController = exports.loginController = exports.registerController = void 0;
const userService = __importStar(require("../services/user.service"));
const registerController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, status, dateOfBirth, hobbies, bio } = req.body;
        const user = yield userService.registerService({
            name,
            email,
            password,
            status,
            dateOfBirth,
            hobbies,
            bio,
        });
        console.log("user", user);
        res.status(201).json({
            success: true,
            data: user,
            message: "You have been successfully registered. Please check your email for verfication",
        });
    }
    catch (error) {
        console.log("register, error", error);
        next(error);
    }
});
exports.registerController = registerController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userService.loginService({ email, password });
        console.log("user", user);
        res.status(200).json({
            success: true,
            message: "You have been logged in successfully",
            data: user,
        });
    }
    catch (error) {
        console.log("lgoin error", error);
        next(error);
    }
});
exports.loginController = loginController;
const verifyEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        console.log("email and code", email, code);
        const result = yield userService.verifyEmailService(email, code);
        res.status(201).json({
            success: true,
            result,
            message: "You are now successfully verified. You can access the resources now",
        });
    }
    catch (error) {
        console.log("error", error);
        next(error);
    }
});
exports.verifyEmailController = verifyEmailController;
const getMeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const user = yield userService.getMeService(userId);
    }
    catch (error) {
        next(error);
    }
});
exports.getMeController = getMeController;
const updateProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userService.updateProfileService();
        res.status(201).json({
            success: true,
            data: result,
            message: "The email has been successfully sent",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfileController = updateProfileController;
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userService.changePasswordService();
    }
    catch (error) {
        next(error);
    }
});
exports.changePasswordController = changePasswordController;
const forgotPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield userService.forgotPasswordService(email);
        res
            .status(201)
            .json({ success: true, message: "The email has been successfully sent" });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPasswordController = forgotPasswordController;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, confirmPassword, code, userId } = req.body;
        const result = yield userService.resetPasswordService(newPassword, confirmPassword, code, userId);
        res.status(201).json({
            success: true,
            data: null,
            message: "Your password have been successfully changed",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordController = resetPasswordController;
const logoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userService.logoutService();
        res.status(200).json({
            success: true,
            data: null,
            message: "You have been successfully logged Out.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutController = logoutController;
