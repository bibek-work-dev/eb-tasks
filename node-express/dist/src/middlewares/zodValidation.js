"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidate = void 0;
const zodValidate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (result.error) {
            const combinedMessage = result.error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ");
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: combinedMessage || "Something went wrong",
                error: "BadRequest",
            });
        }
        req.body = result.data;
        next();
    };
};
exports.zodValidate = zodValidate;
