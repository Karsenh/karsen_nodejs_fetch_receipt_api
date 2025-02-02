export const createSuccessResponse = (status, message, data = null) => {
    return {
        status, message, data
    }
}