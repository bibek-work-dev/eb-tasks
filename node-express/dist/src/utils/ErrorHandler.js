"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.InternalSeverError = void 0;
class ErrorHanlder extends Error {
    constructor(statusCode, message = "Internal Server Error", error = "BadRequest") {
        console.log(statusCode, message, error);
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}
class InternalSeverError extends ErrorHanlder {
    constructor() {
        super(500, "Something went wrong", "InternalServerError");
        console.log("internal server error", this.message);
    }
}
exports.InternalSeverError = InternalSeverError;
class BadRequestError extends ErrorHanlder {
    constructor(message = "Provde Valid Data") {
        super(400, message, "BadReqest");
        console.log("bad request error", this.message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ErrorHanlder {
    constructor(message = "The requested resource haven't been found") {
        super(404, message, "NotFound");
        console.log("not found error", this.message);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ErrorHanlder {
    constructor(message = "You aren't authorized") {
        super(401, message, "Unauthorized");
        console.log("unauthorized error", this.message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
