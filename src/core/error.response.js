"use strict";
import HttpStatusCode from "../utils/httpStatusCode.js"

const { StatusCodes, ReasonPhrases} = HttpStatusCode
const StatusCode = {
    NOT_FOUND: 404,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict error",
}
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export class ConflicRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

export class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}