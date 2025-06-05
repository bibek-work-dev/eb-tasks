"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidate = void 0;
const zodValidate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        console.log("result", result);
        if (result.error) {
            res.status(400).json({
                success: false,
                message: "Something went wrong",
            });
        }
        next();
    };
};
exports.zodValidate = zodValidate;
