"use strict";
class ErrorHanlder extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
// statusCode, success, message, errors:[]
