import {createError} from "h3";

// Error
export const notFound = createError({statusCode: 404, statusMessage: "Not Found"})
export const badRequest = createError({statusCode: 400, statusMessage: "Bad Request"})
