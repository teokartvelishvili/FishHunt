"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BannerService", {
    enumerable: true,
    get: function() {
        return BannerService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _bannerschema = require("../schemas/banner.schema");
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
let BannerService = class BannerService {
    async create(createBannerDto) {
        const banner = new this.bannerModel(createBannerDto);
        return banner.save();
    }
    async findAll() {
        return this.bannerModel.find().sort({
            sortOrder: 1,
            createdAt: -1
        }).exec();
    }
    async findActive() {
        return this.bannerModel.find({
            isActive: true
        }).sort({
            sortOrder: 1,
            createdAt: -1
        }).exec();
    }
    async findOne(id) {
        return this.bannerModel.findById(id).exec();
    }
    async update(id, updateBannerDto) {
        return this.bannerModel.findByIdAndUpdate(id, updateBannerDto, {
            new: true
        }).exec();
    }
    async remove(id) {
        await this.bannerModel.findByIdAndDelete(id).exec();
    }
    constructor(bannerModel){
        this.bannerModel = bannerModel;
    }
};
BannerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_bannerschema.Banner.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], BannerService);

//# sourceMappingURL=banner.service.js.map