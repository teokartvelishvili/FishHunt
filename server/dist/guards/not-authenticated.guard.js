"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotAuthenticatedGuard", {
    enumerable: true,
    get: function() {
        return NotAuthenticatedGuard;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotAuthenticatedGuard = class NotAuthenticatedGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return true; // Allow access if no token
        }
        const token = authHeader.split(' ')[1];
        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_SECRET
            });
            return false; // Deny access if token is valid
        } catch  {
            return true; // Allow access if token is invalid
        }
    }
    constructor(jwtService){
        this.jwtService = jwtService;
    }
};
NotAuthenticatedGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], NotAuthenticatedGuard);

//# sourceMappingURL=not-authenticated.guard.js.map