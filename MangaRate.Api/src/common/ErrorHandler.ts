import {
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from "express";
import { Logger } from 'tslog';
import { ValidateError } from "tsoa";
import { ApiError, ApiResponseError } from "./ApiError";

const log = new Logger();

export function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    // TODO: Handle HttpError happening when can't parse request into json.
    if (err instanceof ValidateError) {
        log.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        const ret: ApiResponseError = {
            message: "Validation Failed",
            statusCode: 415,
            details: JSON.stringify(err?.fields)
        };
        return res.status(415).json(ret);
    }
    if (err instanceof ApiError) {
        const ret: ApiResponseError = {
            message: err.message,
            statusCode: err.statusCode,
            details: ""
        };
        return res.status(err.statusCode).json(ret);
    }
    if (err instanceof Error) {
        log.error("There was an unhandled error !", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
}