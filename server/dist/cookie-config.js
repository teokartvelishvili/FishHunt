"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cookieConfig", {
    enumerable: true,
    get: function() {
        return cookieConfig;
    }
});
const cookieConfig = {
    access: {
        name: 'access_token',
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 10 * 60 * 1000
        }
    },
    refresh: {
        name: 'refresh_token',
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    }
};

//# sourceMappingURL=cookie-config.js.map