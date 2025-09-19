import { Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from "../common/constants";



export function successResponse(res: Response, data: any, message = "SUCCESS", statusCode = HTTP_STATUS_CODES.CREATED) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export function badRequestResponse(res: Response, message = ERROR_MESSAGES.BAD_REQUEST, statusCode = HTTP_STATUS_CODES.BAD_REQUEST) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function unauthorizedResponse(res: Response, message = ERROR_MESSAGES.UNAUTHORIZED, statusCode = HTTP_STATUS_CODES.UNAUTHORIZED) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function conflictResponse(res: Response, message = ERROR_MESSAGES.DUPLICATE, statusCode = HTTP_STATUS_CODES.CONFLICT) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function serverErrorResponse(res: Response, message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR, statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}
export function unprocessableEntityResponse(res: Response, message = ERROR_MESSAGES.SERVICE_UNAVAILABLE, statusCode = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function notFoundErrorResponse(res: Response, message = ERROR_MESSAGES.NOT_FOUND, statusCode = HTTP_STATUS_CODES.NOT_FOUND) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

