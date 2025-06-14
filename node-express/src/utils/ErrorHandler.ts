class ErrorHanlder extends Error {
  private statusCode: number;
  private error: string;
  constructor(
    statusCode: number,
    message: string = "Internal Server Error",
    error: string = "BadRequest"
  ) {
    console.log(statusCode, message, error);
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

export class InternalSeverError extends ErrorHanlder {
  constructor() {
    super(500, "Something went wrong", "InternalServerError");
    console.log("internal server error", this.message);
  }
}

export class BadRequestError extends ErrorHanlder {
  constructor(message: string = "Provde Valid Data") {
    super(400, message, "BadReqest");
    console.log("bad request error", this.message);
  }
}

export class NotFoundError extends ErrorHanlder {
  constructor(message: string = "The requested resource haven't been found") {
    super(404, message, "NotFound");
    console.log("not found error", this.message);
  }
}

export class ConflictError extends ErrorHanlder {
  constructor(
    message: string = "The request conflicts with the current state of the server"
  ) {
    super(409, message, "Conflict");
  }
}

export class UnauthorizedError extends ErrorHanlder {
  constructor(message: string = "You aren't authorized") {
    super(401, message, "Unauthorized");
    console.log("unauthorized error", this.message);
  }
}

export class ForbiddenError extends ErrorHanlder {
  constructor(message: string = "You aren;t allowed to access this resources") {
    super(403, message, "Forbidden");
  }
}
