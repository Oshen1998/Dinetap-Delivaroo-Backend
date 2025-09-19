import { Response } from "express";



export function successResponse(res: Response, data: any, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export function badRequestResponse(res: Response, message = "Bad Request", statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function unauthorizedResponse(res: Response, message = "Unauthorized", statusCode = 401) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function conflictResponse(res: Response, message = "Conflict", statusCode = 409) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function serverErrorResponse(res: Response, message = "Internal Server Error", statusCode = 500) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}
export function unprocessableEntityResponse(res: Response, message = "Unprocessable Entity", statusCode = 422) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

export function notFoundErrorResponse(res: Response, message = "Not Found Error", statusCode = 404) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
}

