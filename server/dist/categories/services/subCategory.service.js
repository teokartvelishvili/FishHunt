"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubCategoryService", {
    enumerable: true,
    get: function() {
        return SubCategoryService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _subcategoryschema = require("../schemas/subcategory.schema");
const _categoryschema = require("../schemas/category.schema");
const _colorservice = require("./color.service");
const _sizeservice = require("./size.service");
const _agegroupservice = require("./age-group.service");
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
let SubCategoryService = class SubCategoryService {
    async findAll(categoryId, includeInactive = false) {
        console.log(`[SubCategoryService] findAll called. categoryId: "${categoryId}", includeInactive: ${includeInactive}`);
        const filter = includeInactive ? {} : {
            isActive: true
        };
        if (categoryId) {
            console.log(`[SubCategoryService] Processing with categoryId: "${categoryId}"`);
            if (!(0, _mongoose1.isValidObjectId)(categoryId)) {
                console.error(`[SubCategoryService] Invalid category ID format provided: "${categoryId}"`);
                throw new _common.BadRequestException(`Invalid category ID format: ${categoryId}`);
            }
            try {
                const categoryExists = await this.categoryModel.findById(categoryId).exec();
                if (!categoryExists) {
                    console.warn(`[SubCategoryService] Category with ID "${categoryId}" not found in database.`);
                    throw new _common.NotFoundException(`Category with ID ${categoryId} not found`);
                }
                console.log(`[SubCategoryService] Category "${categoryId}" confirmed to exist.`);
                filter.categoryId = categoryId;
            } catch (error) {
                console.error(`[SubCategoryService] Error during category existence check for ID "${categoryId}":`, error.message);
                if (error instanceof _common.NotFoundException || error instanceof _common.BadRequestException) {
                    throw error;
                }
                // For other errors, throw a generic server error
                throw new _common.InternalServerErrorException(`An error occurred while verifying category ID ${categoryId}`);
            }
        } else {
            console.log('[SubCategoryService] No categoryId provided. Fetching subcategories based on isActive status only.');
        }
        try {
            console.log('[SubCategoryService] Executing find query with filter:', JSON.stringify(filter));
            const subcategories = await this.subCategoryModel.find(filter).populate('categoryId', 'name') // Ensure category name is populated
            .sort({
                name: 1
            }).exec();
            console.log(`[SubCategoryService] Database query returned ${subcategories.length} subcategories.`);
            if (subcategories.length > 0) {
                console.log('[SubCategoryService] Example of first subcategory found:', JSON.stringify(subcategories[0]));
            } else if (categoryId) {
                console.log(`[SubCategoryService] No subcategories found for categoryId: "${categoryId}" with current filters.`);
            }
            return subcategories;
        } catch (error) {
            console.error(`[SubCategoryService] Database error while finding subcategories:`, error.message, error.stack);
            throw new _common.InternalServerErrorException('A database error occurred while retrieving subcategories');
        }
    }
    async findById(id) {
        if (!(0, _mongoose1.isValidObjectId)(id)) {
            throw new _common.BadRequestException(`Invalid subcategory ID format: ${id}`);
        }
        const subcategory = await this.subCategoryModel.findById(id).populate('categoryId', 'name').exec();
        if (!subcategory) {
            throw new _common.NotFoundException(`Subcategory with ID ${id} not found`);
        }
        return subcategory;
    }
    async create(createSubCategoryDto) {
        // Check if category exists
        const categoryExists = await this.categoryModel.findById(createSubCategoryDto.categoryId).exec();
        if (!categoryExists) {
            throw new _common.NotFoundException(`Category with ID ${createSubCategoryDto.categoryId} not found`);
        }
        // Check if subcategory with same name exists under the same category
        const existingSubCategory = await this.subCategoryModel.findOne({
            name: createSubCategoryDto.name,
            categoryId: createSubCategoryDto.categoryId
        }).exec();
        if (existingSubCategory) {
            throw new _common.ConflictException(`Subcategory with name "${createSubCategoryDto.name}" already exists in this category`);
        }
        const newSubCategory = new this.subCategoryModel(createSubCategoryDto);
        return newSubCategory.save();
    }
    async update(id, updateSubCategoryDto) {
        if (!(0, _mongoose1.isValidObjectId)(id)) {
            throw new _common.BadRequestException(`Invalid subcategory ID format: ${id}`);
        }
        // If updating the category, check if it exists
        if (updateSubCategoryDto.categoryId) {
            const categoryExists = await this.categoryModel.findById(updateSubCategoryDto.categoryId).exec();
            if (!categoryExists) {
                throw new _common.NotFoundException(`Category with ID ${updateSubCategoryDto.categoryId} not found`);
            }
        }
        // If updating name, check for duplicates
        if (updateSubCategoryDto.name) {
            const existingSubCategory = await this.subCategoryModel.findOne({
                name: updateSubCategoryDto.name,
                categoryId: updateSubCategoryDto.categoryId || {
                    $exists: true
                },
                _id: {
                    $ne: id
                }
            }).exec();
            if (existingSubCategory) {
                throw new _common.ConflictException(`Subcategory with name "${updateSubCategoryDto.name}" already exists in this category`);
            }
        }
        const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(id, updateSubCategoryDto, {
            new: true
        }).populate('categoryId', 'name').exec();
        if (!updatedSubCategory) {
            throw new _common.NotFoundException(`Subcategory with ID ${id} not found`);
        }
        return updatedSubCategory;
    }
    async remove(id) {
        if (!(0, _mongoose1.isValidObjectId)(id)) {
            throw new _common.BadRequestException(`Invalid subcategory ID format: ${id}`);
        }
        const result = await this.subCategoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new _common.NotFoundException(`Subcategory with ID ${id} not found`);
        }
    }
    // Get all attribute options available for categories
    async getAttributeOptions() {
        const colors = await this.getAllColors();
        const sizes = await this.getAllSizes();
        const ageGroups = await this.getAllAgeGroups();
        return {
            colors,
            sizes,
            ageGroups
        };
    }
    // Global attribute management methods
    async getAllColors() {
        try {
            console.log('Getting all colors from service');
            const colors = await this.colorService.findAll(false);
            console.log(`Found ${colors.length} colors`);
            return colors.map((color)=>color.name);
        } catch (error) {
            console.error('Error getting all colors:', error);
            return [];
        }
    }
    async getAllSizes() {
        try {
            console.log('Getting all sizes from service');
            const sizes = await this.sizeService.findAll(false);
            console.log(`Found ${sizes.length} sizes`);
            return sizes.map((size)=>size.value);
        } catch (error) {
            console.error('Error getting all sizes:', error);
            return [];
        }
    }
    async getAllAgeGroups() {
        try {
            console.log('Getting all age groups from service');
            const ageGroups = await this.ageGroupService.findAll(false);
            console.log(`Found ${ageGroups.length} age groups`);
            return ageGroups.map((ageGroup)=>ageGroup.name);
        } catch (error) {
            console.error('Error getting all age groups:', error);
            return [];
        }
    }
    // Color management
    async createColor(colorName) {
        return this.colorService.create({
            name: colorName
        });
    }
    async updateColor(oldName, newName) {
        const color = await this.colorService.findAll().then((colors)=>colors.find((c)=>c.name === oldName));
        if (!color) {
            throw new _common.NotFoundException(`Color "${oldName}" not found`);
        }
        return this.colorService.update(color._id.toString(), {
            name: newName
        });
    }
    async deleteColor(colorName) {
        const color = await this.colorService.findAll().then((colors)=>colors.find((c)=>c.name === colorName));
        if (!color) {
            throw new _common.NotFoundException(`Color "${colorName}" not found`);
        }
        return this.colorService.remove(color._id.toString());
    }
    // Size management
    async createSize(sizeValue) {
        return this.sizeService.create({
            value: sizeValue
        });
    }
    async updateSize(oldValue, newValue) {
        const size = await this.sizeService.findAll().then((sizes)=>sizes.find((s)=>s.value === oldValue));
        if (!size) {
            throw new _common.NotFoundException(`Size "${oldValue}" not found`);
        }
        return this.sizeService.update(size._id.toString(), {
            value: newValue
        });
    }
    async deleteSize(sizeValue) {
        const size = await this.sizeService.findAll().then((sizes)=>sizes.find((s)=>s.value === sizeValue));
        if (!size) {
            throw new _common.NotFoundException(`Size "${sizeValue}" not found`);
        }
        return this.sizeService.remove(size._id.toString());
    }
    // Age group management
    async createAgeGroup(ageGroupName) {
        return this.ageGroupService.create({
            name: ageGroupName
        });
    }
    async updateAgeGroup(oldName, newName) {
        const ageGroup = await this.ageGroupService.findAll().then((ageGroups)=>ageGroups.find((a)=>a.name === oldName));
        if (!ageGroup) {
            throw new _common.NotFoundException(`Age group "${oldName}" not found`);
        }
        return this.ageGroupService.update(ageGroup._id.toString(), {
            name: newName
        });
    }
    async deleteAgeGroup(ageGroupName) {
        const ageGroup = await this.ageGroupService.findAll().then((ageGroups)=>ageGroups.find((a)=>a.name === ageGroupName));
        if (!ageGroup) {
            throw new _common.NotFoundException(`Age group "${ageGroupName}" not found`);
        }
        return this.ageGroupService.remove(ageGroup._id.toString());
    }
    constructor(subCategoryModel, categoryModel, colorService, sizeService, ageGroupService){
        this.subCategoryModel = subCategoryModel;
        this.categoryModel = categoryModel;
        this.colorService = colorService;
        this.sizeService = sizeService;
        this.ageGroupService = ageGroupService;
    }
};
SubCategoryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_subcategoryschema.SubCategory.name)),
    _ts_param(1, (0, _mongoose.InjectModel)(_categoryschema.Category.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _colorservice.ColorService === "undefined" ? Object : _colorservice.ColorService,
        typeof _sizeservice.SizeService === "undefined" ? Object : _sizeservice.SizeService,
        typeof _agegroupservice.AgeGroupService === "undefined" ? Object : _agegroupservice.AgeGroupService
    ])
], SubCategoryService);

//# sourceMappingURL=subCategory.service.js.map