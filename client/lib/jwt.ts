// JWT token utilities

interface JWTPayload {
    id: number;
    iat: number; // issued at
    exp: number; // expiration time
}

/**
 * Decode JWT token without verification
 * Note: This only decodes the payload, it doesn't verify the signature
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return true;
    }

    // Check if token is expired (with 30 second buffer)
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now + 30;
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string): number | null {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }

    return payload.exp * 1000; // Convert to milliseconds
}

/**
 * Get time until token expires in milliseconds
 */
export function getTimeUntilExpiration(token: string): number | null {
    const expiration = getTokenExpiration(token);
    if (!expiration) {
        return null;
    }

    const timeLeft = expiration - Date.now();
    return timeLeft > 0 ? timeLeft : 0;
}