"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalAuthGuard", {
    enumerable: true,
    get: function() {
        return LocalAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LocalAuthGuard = class LocalAuthGuard extends (0, _passport.AuthGuard)('local') {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;
        if (email.length === 0 || password.length === 0 || !(0, _classvalidator.isString)(password) || !(0, _classvalidator.isString)(email)) {
            throw new _common.BadRequestException('Please enter a valid email and password.');
        }
        const parentCanActivate = await super.canActivate(context);
        return parentCanActivate;
    }
};
LocalAuthGuard = _ts_decorate([
    (0, _common.Injectable)()
], LocalAuthGuard);

//# sourceMappingURL=local-auth.guard.js.map