"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ColorService", {
    enumerable: true,
    get: function() {
        return ColorService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _colorschema = require("../schemas/color.schema");
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
let ColorService = class ColorService {
    async findAll(includeInactive = false) {
        try {
            const filter = includeInactive ? {} : {
                isActive: true
            };
            const colors = await this.colorModel.find(filter).sort({
                name: 1
            }).exec();
            console.log(`Color service found ${colors.length} colors`);
            return colors;
        } catch (error) {
            console.error('Error finding colors:', error);
            return [];
        }
    }
    async findById(id) {
        const color = await this.colorModel.findById(id).exec();
        if (!color) {
            throw new _common.NotFoundException(`Color with ID ${id} not found`);
        }
        return color;
    }
    async create(createColorDto) {
        const existingColor = await this.colorModel.findOne({
            name: createColorDto.name
        }).exec();
        if (existingColor) {
            throw new _common.ConflictException(`Color with name ${createColorDto.name} already exists`);
        }
        const newColor = new this.colorModel(createColorDto);
        return newColor.save();
    }
    async update(id, updateColorDto) {
        // Validate that id is a valid MongoDB ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new _common.NotFoundException(`Invalid color ID format: ${id}`);
        }
        if (updateColorDto.name) {
            const existingColor = await this.colorModel.findOne({
                name: updateColorDto.name,
                _id: {
                    $ne: id
                }
            }).exec();
            if (existingColor) {
                throw new _common.ConflictException(`Color with name ${updateColorDto.name} already exists`);
            }
        }
        const updatedColor = await this.colorModel.findByIdAndUpdate(id, updateColorDto, {
            new: true
        }).exec();
        if (!updatedColor) {
            throw new _common.NotFoundException(`Color with ID ${id} not found`);
        }
        return updatedColor;
    }
    async remove(id) {
        // Validate that id is a valid MongoDB ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new _common.NotFoundException(`Invalid color ID format: ${id}`);
        }
        const result = await this.colorModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new _common.NotFoundException(`Color with ID ${id} not found`);
        }
    }
    constructor(colorModel){
        this.colorModel = colorModel;
    }
};
ColorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_colorschema.Color.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], ColorService);

//# sourceMappingURL=color.service.js.map