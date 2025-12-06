"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SizeService", {
    enumerable: true,
    get: function() {
        return SizeService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _sizeschema = require("../schemas/size.schema");
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
let SizeService = class SizeService {
    async findAll(includeInactive = false) {
        try {
            const filter = includeInactive ? {} : {
                isActive: true
            };
            const sizes = await this.sizeModel.find(filter).sort({
                value: 1
            }).exec();
            console.log(`Size service found ${sizes.length} sizes`);
            return sizes;
        } catch (error) {
            console.error('Error finding sizes:', error);
            return [];
        }
    }
    async findById(id) {
        const size = await this.sizeModel.findById(id).exec();
        if (!size) {
            throw new _common.NotFoundException(`Size with ID ${id} not found`);
        }
        return size;
    }
    async create(createSizeDto) {
        const existingSize = await this.sizeModel.findOne({
            value: createSizeDto.value
        }).exec();
        if (existingSize) {
            throw new _common.ConflictException(`Size with value ${createSizeDto.value} already exists`);
        }
        const newSize = new this.sizeModel(createSizeDto);
        return newSize.save();
    }
    async update(id, updateSizeDto) {
        if (updateSizeDto.value) {
            const existingSize = await this.sizeModel.findOne({
                value: updateSizeDto.value,
                _id: {
                    $ne: id
                }
            }).exec();
            if (existingSize) {
                throw new _common.ConflictException(`Size with value ${updateSizeDto.value} already exists`);
            }
        }
        const updatedSize = await this.sizeModel.findByIdAndUpdate(id, updateSizeDto, {
            new: true
        }).exec();
        if (!updatedSize) {
            throw new _common.NotFoundException(`Size with ID ${id} not found`);
        }
        return updatedSize;
    }
    async remove(id) {
        const result = await this.sizeModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new _common.NotFoundException(`Size with ID ${id} not found`);
        }
    }
    constructor(sizeModel){
        this.sizeModel = sizeModel;
    }
};
SizeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_sizeschema.Size.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], SizeService);

//# sourceMappingURL=size.service.js.map