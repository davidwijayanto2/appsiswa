export const cookieOpt = (extraParams = {}) => {
    const params = {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    };
    params => ({
        ...params,
        ...extraParams
    });
    return params;
}