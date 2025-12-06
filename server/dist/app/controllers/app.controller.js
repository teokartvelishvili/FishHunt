"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppController", {
    enumerable: true,
    get: function() {
        return AppController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _appservice = require("../services/app.service");
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
let AppController = class AppController {
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString()
        };
    }
    root() {
        return {
            status: 'ok',
            message: 'FishHunt API is running'
        };
    }
    async uploadFile(file) {
        const response = await this.appService.uploadImageToCloudinary(file);
        return response.url;
    }
    constructor(appService){
        this.appService = appService;
    }
};
_ts_decorate([
    (0, _common.Get)('health'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "healthCheck", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "root", null);
_ts_decorate([
    (0, _common.Post)('upload'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('image')),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], AppController.prototype, "uploadFile", null);
AppController = _ts_decorate([
    (0, _common.Controller)(''),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService
    ])
], AppController);

//# sourceMappingURL=app.controller.js.map