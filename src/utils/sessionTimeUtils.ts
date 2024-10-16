const TOKEN_EXPIRATION_HOURS = 1.5; // Define expiration duration in hours

export const getSessionExpirationTime = (): Date => {
    return new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 3600 * 1000); // 3600 seconds in an hour
};