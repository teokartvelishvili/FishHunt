"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _usersservice = require("./users.service");
const _jwt = require("@nestjs/jwt");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _password = require("../../utils/password");
const _crypto = require("crypto");
const _roleenum = require("../../types/role.enum");
const _emailservices = require("../../email/services/email.services");
const _uuid = require("uuid");
const _userschema = require("../schemas/user.schema");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuthService = class AuthService {
    async requestPasswordReset(email) {
        // Convert email to lowercase
        const lowercaseEmail = email.toLowerCase();
        // Find user with lowercase email
        const user = await this.usersService.findByEmail(lowercaseEmail);
        if (!user) {
            throw new _common.BadRequestException('მომხმარებელი ვერ მოიძებნა');
        }
        const resetToken = (0, _uuid.v4)();
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 საათი
        await user.save();
        await this.emailService.sendPasswordResetEmail(email, resetToken);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: {
                $gt: new Date()
            }
        });
        if (!user) {
            throw new _common.BadRequestException('Invalid or expired token');
        }
        user.password = await (0, _password.hashPassword)(newPassword);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
    }
    async singInWithGoogle(googleData) {
        // Convert email to lowercase
        const email = googleData.email.toLowerCase();
        let existUser = await this.userModel.findOne({
            email
        });
        console.log('🆕 ახალი მომხმარებლის რეგისტრაცია Google-ით:', googleData);
        if (!existUser) {
            const newUser = new this.userModel({
                email,
                name: googleData.name || 'Google User',
                googleId: googleData.id || googleData.sub,
                role: _roleenum.Role.User
            });
            await newUser.save(); // ⬅️ აქამდე უკვე აქვს googleId მნიშვნელობა, ამიტომ password არ ითვლება required
            existUser = newUser;
            console.log('✅ ახალი მომხმარებელი წარმატებით დაემატა:', existUser);
        }
        const { tokens, user: userData } = await this.login(existUser);
        console.log('✅ გენერირებული access_token და refresh_token:', tokens);
        return {
            tokens,
            user: userData
        };
    }
    async validateUser(email, password) {
        // Convert email to lowercase for case-insensitive comparison
        const lowercaseEmail = email.toLowerCase();
        const user = await this.usersService.findByEmail(lowercaseEmail);
        if (!user) {
            throw new _common.UnauthorizedException('არასწორი მეილი ან პაროლი.');
        }
        const isPasswordValid = await (0, _password.verifyPassword)(user.password, password);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('არასწორი მეილი ან პაროლი.');
        }
        return user;
    }
    async login(user) {
        const tokens = await this.generateTokens(user);
        return {
            tokens,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                // isAdmin: user.isAdmin,
                role: user.role
            }
        };
    }
    async generateTokens(user) {
        const jti = (0, _crypto.randomUUID)();
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
                // isAdmin: user.isAdmin,
                role: user.role,
                type: 'access'
            }, {
                expiresIn: '20m',
                secret: process.env.JWT_ACCESS_SECRET
            }),
            this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
                // isAdmin: user.isAdmin,
                role: user.role,
                type: 'refresh',
                jti
            }, {
                expiresIn: '7d',
                secret: process.env.JWT_REFRESH_SECRET
            })
        ]);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: jti
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });
            if (payload.type !== 'refresh' || !payload.jti) {
                throw new _common.UnauthorizedException();
            }
            const user = await this.userModel.findById(payload.sub);
            if (!user || !user.refreshToken) {
                throw new _common.UnauthorizedException();
            }
            if (user.refreshToken !== payload.jti) {
                throw new _common.UnauthorizedException('Invalid refresh token');
            }
            return this.generateTokens(user);
        } catch  {
            throw new _common.UnauthorizedException();
        }
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null
        });
    }
    constructor(usersService, jwtService, emailService, userModel){
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.userModel = userModel;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _mongoose.InjectModel)(_userschema.User.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _emailservices.EmailService === "undefined" ? Object : _emailservices.EmailService,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map