import { jwtDecode } from 'jwt-decode';

export const isJwtExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return true;
    }
}
