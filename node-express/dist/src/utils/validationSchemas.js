"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(15),
    status: zod_1.z.enum(["Active", "InActive"]).optional(),
    dateOfBirth: zod_1.z.string().date(),
    hobbies: zod_1.z.array(zod_1.z.string()),
    bio: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(15),
});
