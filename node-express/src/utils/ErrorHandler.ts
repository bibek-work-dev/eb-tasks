class ErrorHanlder extends Error {
  private statusCode: number;
  private error: string;
  constructor(
    statusCode: number,
    message: string = "Internal Server Error",
    error: string = "BadRequest"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

export class InternalSeverError extends ErrorHanlder {
  constructor() {
    super(500, "Something went wrong", "InternalServerError");
  }
}

export class BadRequestError extends ErrorHanlder {
  constructor(message: string = "Provde Valid Data") {
    super(400, message, "BadReqest");
  }
}

export class NotFoundError extends ErrorHanlder {
  constructor(message: string = "The requested resource haven't been found") {
    super(404, message, "NotFound");
  }
}

export class UnauthorizedError extends ErrorHanlder {
  constructor(message: string = "You aren't authorized") {
    super(401, message, "Unauthorized");
  }
}
// statusCode, success, message, errors:[]
