"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleStrategy", {
    enumerable: true,
    get: function() {
        return GoogleStrategy;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _passport = require("@nestjs/passport");
const _passportgoogleoauth2 = require("passport-google-oauth2");
const _roleenum = require("../types/role.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleStrategy = class GoogleStrategy extends (0, _passport.PassportStrategy)(_passportgoogleoauth2.Strategy, 'google') {
    async validate(accessToken, refreshToken, profile, done) {
        const user = {
            name: `${profile.given_name} ${profile.family_name}`,
            email: profile.email,
            googleId: profile.id,
            avatar: profile.picture,
            password: '',
            role: _roleenum.Role.User
        };
        done(null, user);
    }
    constructor(configService){
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: [
                'profile',
                'email'
            ]
        }), this.configService = configService;
    }
};
GoogleStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], GoogleStrategy);

//# sourceMappingURL=google.strategy.js.map