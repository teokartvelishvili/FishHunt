"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _roleenum = require("../../types/role.enum");
const _rolesguard = require("../../guards/roles.guard");
const _serializeinterceptor = require("../../interceptors/serialize.interceptor");
const _adminprofiledto = require("../dtos/admin.profile.dto");
const _userdto = require("../dtos/user.dto");
const _usersservice = require("../services/users.service");
const _paginatedusersdto = require("../dtos/paginated-users.dto");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _platformexpress = require("@nestjs/platform-express");
const _currentuserdecorator = require("../../decorators/current-user.decorator");
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
let UsersController = class UsersController {
    async getUsers(page = '1', limit = '20') {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return this.usersService.findAll(pageNumber, limitNumber);
    }
    deleteUser(id) {
        return this.usersService.deleteOne(id);
    }
    getUser(id) {
        return this.usersService.findById(id);
    }
    async updateUser(id, credentials) {
        console.log('Admin updating user', id, 'with data:', credentials);
        return this.usersService.adminUpdate(id, credentials);
    }
    async generateUsers() {
        return this.usersService.generateUsers(500);
    }
    async getUserByEmail(email) {
        return this.usersService.findOne(email);
    }
    async createUser(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async uploadProfileImage(user, file) {
        if (!file) {
            throw new _common.BadRequestException('No file uploaded');
        }
        // Check file type
        const validMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif'
        ];
        if (!validMimeTypes.includes(file.mimetype.toLowerCase()) && !file.mimetype.toLowerCase().startsWith('image/')) {
            throw new _common.BadRequestException(`Unsupported file type: ${file.mimetype}. Supported types: JPEG, PNG, GIF, WEBP.`);
        }
        const timestamp = Date.now();
        const filePath = `profile-images/${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filesSizeInMb = Number((file.size / (1024 * 1024)).toFixed(1));
        if (filesSizeInMb > 5) {
            throw new _common.BadRequestException('The file must be less than 5 MB.');
        }
        // Use string casting to access _id property
        return this.usersService.updateProfileImage(user['_id'], filePath, file.buffer);
    }
    async uploadLogo(user, file) {
        // Only admin can upload logos now
        if (user.role !== _roleenum.Role.Admin) {
            throw new _common.BadRequestException('Only admins can upload logos');
        }
        if (!file) {
            throw new _common.BadRequestException('No file uploaded');
        }
        // Check file type - same validation as profile images
        const validMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif'
        ];
        if (!validMimeTypes.includes(file.mimetype.toLowerCase()) && !file.mimetype.toLowerCase().startsWith('image/')) {
            throw new _common.BadRequestException(`Unsupported file type: ${file.mimetype}. Supported types: JPEG, PNG, GIF, WEBP.`);
        }
        const timestamp = Date.now();
        const filePath = `logos/${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filesSizeInMb = Number((file.size / (1024 * 1024)).toFixed(1));
        if (filesSizeInMb > 5) {
            throw new _common.BadRequestException('The file must be less than 5 MB.');
        }
        // Upload image and return the URL
        const logoPath = await this.usersService.uploadImage(filePath, file.buffer);
        const logoUrl = await this.usersService.getProfileImageUrl(logoPath);
        return {
            message: 'Logo uploaded successfully',
            logoUrl: logoUrl
        };
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_paginatedusersdto.PaginatedUsersDto),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('page')),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_userdto.UserDto),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "getUser", null);
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_userdto.UserDto),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.Put)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _adminprofiledto.AdminProfileDto === "undefined" ? Object : _adminprofiledto.AdminProfileDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_userdto.UserDto),
    (0, _common.Post)('seed'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "generateUsers", null);
_ts_decorate([
    (0, _swagger.ApiTags)('Users'),
    (0, _swagger.ApiOperation)({
        summary: 'Find user by email'
    }),
    (0, _common.Get)('email/:email'),
    _ts_param(0, (0, _common.Param)('email')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmail", null);
_ts_decorate([
    (0, _serializeinterceptor.Serialize)(_userdto.UserDto),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminprofiledto.AdminProfileDto === "undefined" ? Object : _adminprofiledto.AdminProfileDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
_ts_decorate([
    (0, _common.Post)('profile-image'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.User === "undefined" ? Object : _userschema.User,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfileImage", null);
_ts_decorate([
    (0, _common.Post)('seller-logo'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.User === "undefined" ? Object : _userschema.User,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "uploadLogo", null);
UsersController = _ts_decorate([
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map