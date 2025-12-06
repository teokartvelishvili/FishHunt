"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppService", {
    enumerable: true,
    get: function() {
        return AppService;
    }
});
const _common = require("@nestjs/common");
const _cloudinaryservice = require("../../cloudinary/services/cloudinary.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppService = class AppService {
    async uploadImageToCloudinary(file) {
        const result = await this.cloudinary.uploadImage(file).catch((err)=>{
            console.log(err);
            throw new _common.BadRequestException('Invalid file type.');
        });
        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_auto,f_auto,w_1024/');
        return optimizedUrl;
    }
    async uploadBannerImageToCloudinary(file) {
        const result = await this.cloudinary.uploadImage(file).catch((err)=>{
            console.log(err);
            throw new _common.BadRequestException('Invalid file type.');
        });
        // For banners, use higher quality and larger size
        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_80,f_auto,w_1920/');
        return optimizedUrl;
    }
    constructor(cloudinary){
        this.cloudinary = cloudinary;
    }
};
AppService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cloudinaryservice.CloudinaryService === "undefined" ? Object : _cloudinaryservice.CloudinaryService
    ])
], AppService);

//# sourceMappingURL=app.service.js.map