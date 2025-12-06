"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgeGroupService", {
    enumerable: true,
    get: function() {
        return AgeGroupService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _agegroupschema = require("../schemas/age-group.schema");
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
let AgeGroupService = class AgeGroupService {
    async findAll(includeInactive = false) {
        try {
            const filter = includeInactive ? {} : {
                isActive: true
            };
            const ageGroups = await this.ageGroupModel.find(filter).sort({
                name: 1
            }).exec();
            console.log(`Age group service found ${ageGroups.length} age groups`);
            return ageGroups;
        } catch (error) {
            console.error('Error finding age groups:', error);
            return [];
        }
    }
    async findById(id) {
        const ageGroup = await this.ageGroupModel.findById(id).exec();
        if (!ageGroup) {
            throw new _common.NotFoundException(`Age group with ID ${id} not found`);
        }
        return ageGroup;
    }
    async findByName(name) {
        try {
            const ageGroup = await this.ageGroupModel.findOne({
                name
            }).exec();
            return ageGroup;
        } catch (error) {
            console.error('Error finding age group by name:', error);
            return null;
        }
    }
    async create(createAgeGroupDto) {
        const existingAgeGroup = await this.ageGroupModel.findOne({
            name: createAgeGroupDto.name
        }).exec();
        if (existingAgeGroup) {
            throw new _common.ConflictException(`Age group with name ${createAgeGroupDto.name} already exists`);
        }
        const newAgeGroup = new this.ageGroupModel(createAgeGroupDto);
        return newAgeGroup.save();
    }
    async update(id, updateAgeGroupDto) {
        if (updateAgeGroupDto.name) {
            const existingAgeGroup = await this.ageGroupModel.findOne({
                name: updateAgeGroupDto.name,
                _id: {
                    $ne: id
                }
            }).exec();
            if (existingAgeGroup) {
                throw new _common.ConflictException(`Age group with name ${updateAgeGroupDto.name} already exists`);
            }
        }
        const updatedAgeGroup = await this.ageGroupModel.findByIdAndUpdate(id, updateAgeGroupDto, {
            new: true
        }).exec();
        if (!updatedAgeGroup) {
            throw new _common.NotFoundException(`Age group with ID ${id} not found`);
        }
        return updatedAgeGroup;
    }
    async remove(id) {
        const result = await this.ageGroupModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new _common.NotFoundException(`Age group with ID ${id} not found`);
        }
    }
    constructor(ageGroupModel){
        this.ageGroupModel = ageGroupModel;
    }
};
AgeGroupService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_agegroupschema.AgeGroup.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], AgeGroupService);

//# sourceMappingURL=age-group.service.js.map