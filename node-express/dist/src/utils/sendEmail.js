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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerficationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter;
transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
        user: "bibek.koirala.ebpearls@gmail.com",
        pass: "lydb tivw hgjd lrnv",
    },
});
const sendVerficationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    //   const trans = await setupEmail();
    // const otp = getRandomNumber();
    const info = yield transporter.sendMail({
        from: "bibek.koirala.ebpearls@gmail.com",
        to: email,
        subject: "Email Verification - Your OTP Code",
        text: `Hello,\n\nPlease verify your email address using the following code:\n\nOTP: ${token}\n\nIf you didn't request this, you can ignore this email.\n\nThanks!`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Email Verification</h2>
        <p>Hello,</p>
        <p>Please verify your email address using the following code:</p>
        <h3 style="color: #2e6da4;">${token}</h3>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>Thanks!</p>
      </div>
    `,
    });
    console.log("Message sent:", info);
});
exports.sendVerficationEmail = sendVerficationEmail;
const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield transporter.sendMail({
        from: '"Bibek - Task App" <bibek.koirala.ebpearls@gmail.com>',
        to: email,
        subject: "Reset Your Password",
        text: `Hello,\n\nYou requested a password reset. Please use the following code to reset your password:\n\nOTP: ${token}\n\nIf you did not request this, you can ignore this email.`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Use the code below:</p>
        <h3 style="color: #d9534f;">${token}</h3>
        <p>This code is valid for a limited time.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    });
    console.log("Reset password email sent:", nodemailer_1.default.getTestMessageUrl(info));
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
