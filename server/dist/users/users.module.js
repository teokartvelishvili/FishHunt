"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersModule", {
    enumerable: true,
    get: function() {
        return UsersModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _authcontroller = require("./controller/auth.controller");
const _userschema = require("./schemas/user.schema");
const _usersservice = require("./services/users.service");
const _authservice = require("./services/auth.service");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _localstrategy = require("../strategies/local.strategy");
const _jwtstrategy = require("../strategies/jwt.strategy");
const _userscontroller = require("./controller/users.controller");
const _googlestrategy = require("../strategies/google.strategy");
const _emailservices = require("../email/services/email.services");
const _awss3module = require("../aws-s3/aws-s3.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsersModule = class UsersModule {
};
UsersModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _userschema.User.name,
                    schema: _userschema.UserSchema
                }
            ]),
            _passport.PassportModule.register({
                defaultStrategy: 'google'
            }),
            _jwt.JwtModule.register({
                global: true,
                secret: process.env.JWT_ACCESS_SECRET,
                signOptions: {
                    expiresIn: '10m'
                }
            }),
            _awss3module.AwsS3Module
        ],
        controllers: [
            _authcontroller.AuthController,
            _userscontroller.UsersController
        ],
        providers: [
            _usersservice.UsersService,
            _authservice.AuthService,
            _localstrategy.LocalStrategy,
            _jwtstrategy.JwtStrategy,
            _authservice.AuthService,
            _googlestrategy.GoogleStrategy,
            _emailservices.EmailService
        ],
        exports: [
            _usersservice.UsersService
        ]
    })
], UsersModule);

//# sourceMappingURL=users.module.js.map