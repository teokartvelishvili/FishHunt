"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BannerController", {
    enumerable: true,
    get: function() {
        return BannerController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _bannerservice = require("../services/banner.service");
const _bannerdto = require("../dtos/banner.dto");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _rolesguard = require("../../guards/roles.guard");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _roleenum = require("../../types/role.enum");
const _appservice = require("../../app/services/app.service");
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
let BannerController = class BannerController {
    async create(createBannerDto, images) {
        try {
            let imageUrl = '';
            if (images && images.length > 0) {
                // Upload image to Cloudinary with banner optimization
                imageUrl = await this.appService.uploadBannerImageToCloudinary(images[0]);
            }
            const banner = await this.bannerService.create({
                ...createBannerDto,
                imageUrl: imageUrl
            });
            return banner;
        } catch (error) {
            throw new _common.HttpException(error.message || 'Error creating banner', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        return this.bannerService.findAll();
    }
    async findActive() {
        return this.bannerService.findActive();
    }
    async findOne(id) {
        return this.bannerService.findOne(id);
    }
    async update(id, updateBannerDto, images) {
        try {
            let imageUrl = updateBannerDto.imageUrl;
            if (images && images.length > 0) {
                // Upload image to Cloudinary with banner optimization
                imageUrl = await this.appService.uploadBannerImageToCloudinary(images[0]);
            }
            const banner = await this.bannerService.update(id, {
                ...updateBannerDto,
                imageUrl: imageUrl
            });
            return banner;
        } catch (error) {
            throw new _common.HttpException(error.message || 'Error updating banner', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        await this.bannerService.remove(id);
        return {
            message: 'Banner deleted successfully'
        };
    }
    constructor(bannerService, appService){
        this.bannerService = bannerService;
        this.appService = appService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.UseInterceptors)((0, _platformexpress.FilesInterceptor)('images', 1)),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bannerdto.CreateBannerDto === "undefined" ? Object : _bannerdto.CreateBannerDto,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('active'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "findActive", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _common.UseInterceptors)((0, _platformexpress.FilesInterceptor)('images', 1)),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _bannerdto.UpdateBannerDto === "undefined" ? Object : _bannerdto.UpdateBannerDto,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], BannerController.prototype, "remove", null);
BannerController = _ts_decorate([
    (0, _common.Controller)('banners'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bannerservice.BannerService === "undefined" ? Object : _bannerservice.BannerService,
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService
    ])
], BannerController);

//# sourceMappingURL=banner.controller.js.map