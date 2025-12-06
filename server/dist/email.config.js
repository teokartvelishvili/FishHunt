"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "emailConfig", {
    enumerable: true,
    get: function() {
        return emailConfig;
    }
});
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    tls: {
        rejectUnauthorized: false
    }
};

//# sourceMappingURL=email.config.js.map