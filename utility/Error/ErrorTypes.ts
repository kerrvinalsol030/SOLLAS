const STATUS_CODES_LIST = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
} as const

// type STATUS_CODES = keyof typeof STATUS_CODES_LIST

class BaseError extends Error {
    public statusCode: number
    public isOperational: boolean
    public errorStack: string
    public logError: string

    constructor(name: string, statusCode: number, description: string, isOperational: boolean, errorStack: string, logingErrorResponse: string) {
        super(description)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.errorStack = errorStack
        this.logError = logingErrorResponse
        Error.captureStackTrace(this)
    }
}
class APIError extends BaseError {
    constructor(description: string = "API Error") {
        super("API internal error", STATUS_CODES_LIST.INTERNAL_ERROR, description, false, '', '')
    }
}


class NotFoundError extends BaseError {
    constructor(description: string = 'Not Found Error') {
        super("Not Found Error", STATUS_CODES_LIST.NOT_FOUND, description, true, '', '')
    }
}

class ValidationError extends BaseError {
    constructor(description: string = "Validation Error") {
        super("Validation Error", STATUS_CODES_LIST.BAD_REQUEST, description, true, '', '')
    }
}

class AuthorizeError extends BaseError {
    constructor(description: string = "access denied") {
        super('access denied', STATUS_CODES_LIST.UNAUTHORIZED, description, true, '', '')
    }
}


export { APIError, NotFoundError, ValidationError, AuthorizeError }