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
                errors: result.error.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                })),
                message: "Something went wrong",
            });
        }
        req.body = result.data;
        next();
    };
};
exports.zodValidate = zodValidate;
