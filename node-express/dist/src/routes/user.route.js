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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/user.controller"));
// import { zodValidation } from "../middlewares/zodValidation";
const usersvalidationSchemas_1 = require("../utils/validations/usersvalidationSchemas");
const zodValidation_1 = require("../middlewares/zodValidation");
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const userRoutes = express_1.default.Router();
userRoutes.post("/register", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.registerSchema), userController.registerController);
userRoutes.post("/login", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.loginSchema), userController.loginController);
userRoutes.post("/verify-email", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.verifyEmailSchema), userController.verifyEmailController);
userRoutes.get("/get-me", requireAuth_1.default, userController.getMeController);
userRoutes.put("/update-profile", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.updateProfileSchema), requireAuth_1.default, userController.updateProfileController);
userRoutes.post("/forgot-password", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.forgotPasswordSchema), userController.forgotPasswordController);
userRoutes.post("/reset-password", (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.resetPasswordSchema), userController.resetPasswordController);
userRoutes.patch("/change-password", requireAuth_1.default, (0, zodValidation_1.zodValidate)(usersvalidationSchemas_1.changePassswordSchema), userController.changePasswordController);
userRoutes.get("/logout", userController.logoutController);
exports.default = userRoutes;
