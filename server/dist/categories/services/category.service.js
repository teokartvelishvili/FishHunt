"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryService", {
    enumerable: true,
    get: function() {
        return CategoryService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _categoryschema = require("../schemas/category.schema");
const _categoriesconstants = require("../categories.constants");
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
let CategoryService = class CategoryService {
    async findAll(includeInactive = false) {
        const filter = includeInactive ? {} : {
            isActive: true
        };
        return this.categoryModel.find(filter).sort({
            name: 1
        }).exec();
    }
    async findById(id) {
        if (!(0, _mongoose1.isValidObjectId)(id)) {
            throw new _common.BadRequestException(`Invalid category ID format: ${id}`);
        }
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new _common.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findByName(name) {
        if (!name || name.trim() === '') {
            throw new _common.BadRequestException('Category name cannot be empty');
        }
        const category = await this.categoryModel.findOne({
            name: name.trim()
        }).exec();
        if (!category) {
            throw new _common.NotFoundException(`Category with name ${name} not found`);
        }
        return category;
    }
    async create(createCategoryDto) {
        // Normalize name to prevent duplicates with different cases or whitespace
        const normalizedName = createCategoryDto.name.trim();
        // Check if a category with the same name exists (case insensitive)
        const existingCategory = await this.categoryModel.findOne({
            name: {
                $regex: new RegExp(`^${normalizedName}$`, 'i')
            }
        }).exec();
        if (existingCategory) {
            throw new _common.ConflictException(`Category with name "${normalizedName}" already exists`);
        }
        // Create new category without any code field
        const newCategory = new this.categoryModel({
            name: normalizedName,
            description: createCategoryDto.description,
            isActive: createCategoryDto.isActive ?? true
        });
        return newCategory.save();
    }
    async update(id, updateCategoryDto) {
        // Check if updating name and if it already exists
        if (updateCategoryDto.name) {
            const existingCategory = await this.categoryModel.findOne({
                name: updateCategoryDto.name,
                _id: {
                    $ne: id
                }
            }).exec();
            if (existingCategory) {
                throw new _common.ConflictException(`Category with name ${updateCategoryDto.name} already exists`);
            }
        }
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
            new: true
        }).exec();
        if (!updatedCategory) {
            throw new _common.NotFoundException(`Category with ID ${id} not found`);
        }
        return updatedCategory;
    }
    async remove(id) {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new _common.NotFoundException(`Category with ID ${id} not found`);
        }
    }
    getDefaultAttributes() {
        return _categoriesconstants.DEFAULT_CATEGORY_STRUCTURE;
    }
    constructor(categoryModel){
        this.categoryModel = categoryModel;
    }
};
CategoryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_categoryschema.Category.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], CategoryService);

//# sourceMappingURL=category.service.js.map