"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _roleenum = require("../../types/role.enum");
const _rolesguard = require("../../guards/roles.guard");
const _currentuserdecorator = require("../../decorators/current-user.decorator");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _localauthguard = require("../../guards/local-auth.guard");
const _serializeinterceptor = require("../../interceptors/serialize.interceptor");
const _profiledto = require("../dtos/profile.dto");
const _registerdto = require("../dtos/register.dto");
const _userdto = require("../dtos/user.dto");
const _userschema = require("../schemas/user.schema");
const _authservice = require("../services/auth.service");
const _usersservice = require("../services/users.service");
const _swagger = require("@nestjs/swagger");
const _authdto = require("../dtos/auth.dto");
const _notauthenticatedguard = require("../../guards/not-authenticated.guard");
const _express = require("express");
const _sellerregisterdto = require("../dtos/seller-register.dto");
const _forgotpassworddto = require("../dtos/forgot-password.dto");
const _resetpassworddto = require("../dtos/reset-password.dto");
const _platformexpress = require("@nestjs/platform-express");
const _googleoauthguard = require("../../guards/google-oauth.guard");
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
let AuthController = class AuthController {
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        let profileImage = null;
        if (user.profileImagePath) {
            profileImage = await this.usersService.getProfileImageUrl(user.profileImagePath);
        }
        const { tokens, user: userData } = await this.authService.login(user);
        return {
            tokens,
            user: {
                ...userData,
                profileImage
            }
        };
    }
    async getProfile(user) {
        return this.usersService.getProfileData(user._id.toString());
    }
    async refresh(body) {
        if (!body.refreshToken) {
            throw new _common.UnauthorizedException('No refresh token');
        }
        const tokens = await this.authService.refresh(body.refreshToken);
        return {
            tokens,
            success: true
        };
    }
    async auth() {}
    async googleAuthRedirect(req, res) {
        try {
            const { tokens, user } = await this.authService.singInWithGoogle({
                email: req.user.email,
                name: req.user.name || 'Google User',
                id: req.user.id
            });
            console.log('✅ Google auth successful, redirecting with tokens');
            const encodedUserData = encodeURIComponent(JSON.stringify(user));
            res.redirect(`${process.env.ALLOWED_ORIGINS}/auth-callback#accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&userData=${encodedUserData}`);
        } catch (error) {
            console.error('Google auth error:', error);
            res.redirect(`${process.env.ALLOWED_ORIGINS}/login?error=auth_failed`);
        }
    }
    async logout(user) {
        await this.authService.logout(user._id.toString());
        return {
            success: true
        };
    }
    async register(registerDto) {
        const user = await this.usersService.create(registerDto);
        return this.authService.login(user);
    }
    async registerSeller(sellerRegisterDto, logoFile) {
        try {
            const seller = await this.usersService.createSeller(sellerRegisterDto, logoFile);
            const { tokens, user } = await this.authService.login(seller);
            return {
                tokens,
                user
            };
        } catch (error) {
            if (error instanceof _common.ConflictException) {
                throw new _common.ConflictException(error.message);
            }
            throw new _common.BadRequestException('Registration failed');
        }
    }
    async updateProfile(user, updateDto) {
        // Filter out undefined fields to make all fields truly optional
        const filteredDto = Object.entries(updateDto).filter(([_, value])=>value !== undefined).reduce((obj, [key, value])=>{
            obj[key] = value;
            return obj;
        }, {});
        return this.usersService.update(user._id.toString(), filteredDto);
    }
    async forgotPassword({ email }) {
        await this.authService.requestPasswordReset(email);
        return {
            message: 'თუ თქვენი მეილი სისტემაში არსებობს, პაროლის აღდგენის ბმული გამოგეგზავნებათ.'
        };
    }
    async resetPassword({ token, newPassword }) {
        await this.authService.resetPassword(token, newPassword);
        return {
            message: 'Password reset successful. You can now log in.'
        };
    }
    constructor(authService, usersService){
        this.authService = authService;
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Login with email and password'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: _authdto.AuthResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    (0, _common.UseGuards)(_notauthenticatedguard.NotAuthenticatedGuard, _localauthguard.LocalAuthGuard),
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authdto.LoginDto === "undefined" ? Object : _authdto.LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_userdto.UserDto),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin, _roleenum.Role.User, _roleenum.Role.Seller),
    (0, _common.Get)('profile'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.Post)('refresh'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Get)('google'),
    (0, _common.UseGuards)(_googleoauthguard.GoogleAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "auth", null);
_ts_decorate([
    (0, _common.Get)('google/callback'),
    (0, _common.UseGuards)(_googleoauthguard.GoogleAuthGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        type: _authdto.AuthResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request - validation error'
    }),
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registerdto.RegisterDto === "undefined" ? Object : _registerdto.RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Register a new seller'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Seller successfully registered',
        type: _authdto.AuthResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request - validation error'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('logoFile')),
    (0, _common.Post)('sellers-register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sellerregisterdto.SellerRegisterDto === "undefined" ? Object : _sellerregisterdto.SellerRegisterDto,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "registerSeller", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin, _roleenum.Role.User, _roleenum.Role.Seller),
    (0, _common.Put)('profile'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        typeof _profiledto.ProfileDto === "undefined" ? Object : _profiledto.ProfileDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
_ts_decorate([
    (0, _common.Post)('forgot-password'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _forgotpassworddto.ForgotPasswordDto === "undefined" ? Object : _forgotpassworddto.ForgotPasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
_ts_decorate([
    (0, _common.Post)('reset-password'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resetpassworddto.ResetPasswordDto === "undefined" ? Object : _resetpassworddto.ResetPasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('Authentication'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map