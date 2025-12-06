"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AttributesController", {
    enumerable: true,
    get: function() {
        return AttributesController;
    }
});
const _common = require("@nestjs/common");
const _subCategoryservice = require("../services/subCategory.service");
const _colordto = require("../dto/color.dto");
const _subcategorydto = require("../dto/subcategory.dto");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _rolesguard = require("../../guards/roles.guard");
const _roleenum = require("../../types/role.enum");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _swagger = require("@nestjs/swagger");
const _colorservice = require("../services/color.service");
const _agegroupservice = require("../services/age-group.service");
const _agegroupdto = require("../dto/age-group.dto");
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
let AttributesController = class AttributesController {
    getAttributeOptions() {
        return this.subCategoryService.getAttributeOptions();
    }
    // Color management
    async getAllColors() {
        try {
            console.log('Fetching all colors from Color collection');
            const colors = await this.colorService.findAll();
            console.log('Colors fetched:', colors);
            return colors;
        } catch (error) {
            console.error('Error fetching colors:', error);
            throw new _common.BadRequestException('Failed to fetch colors: ' + error.message);
        }
    }
    createColor(createColorDto) {
        return this.colorService.create(createColorDto);
    }
    async updateColor(colorName, updateColorDto) {
        try {
            // Decode URL-encoded Georgian text
            const decodedColorName = decodeURIComponent(colorName);
            console.log('Updating color:', {
                original: colorName,
                decoded: decodedColorName
            });
            // Find the color by name first
            const colors = await this.colorService.findAll();
            const existingColor = colors.find((c)=>c.name === decodedColorName);
            if (!existingColor) {
                throw new _common.BadRequestException(`Color with name "${decodedColorName}" not found`);
            }
            console.log('Found existing color:', existingColor);
            // Update using the ObjectId (convert to string)
            return await this.colorService.update(existingColor._id.toString(), updateColorDto);
        } catch (error) {
            console.error('Error updating color:', error);
            if (error instanceof _common.BadRequestException) {
                throw error;
            }
            throw new _common.BadRequestException('Failed to update color: ' + error.message);
        }
    }
    async deleteColor(colorName) {
        try {
            // Decode URL-encoded Georgian text
            const decodedColorName = decodeURIComponent(colorName);
            console.log('Deleting color:', {
                original: colorName,
                decoded: decodedColorName
            });
            // Find the color by name first
            const colors = await this.colorService.findAll();
            const existingColor = colors.find((c)=>c.name === decodedColorName);
            if (!existingColor) {
                throw new _common.BadRequestException(`Color with name "${decodedColorName}" not found`);
            } // Delete using the ObjectId (convert to string)
            return await this.colorService.remove(existingColor._id.toString());
        } catch (error) {
            console.error('Error deleting color:', error);
            if (error instanceof _common.BadRequestException) {
                throw error;
            }
            throw new _common.BadRequestException('Failed to delete color: ' + error.message);
        }
    }
    // Size management
    async getAllSizes() {
        try {
            console.log('Fetching all sizes');
            const sizes = await this.subCategoryService.getAllSizes();
            console.log('Sizes fetched:', sizes);
            return sizes;
        } catch (error) {
            console.error('Error fetching sizes:', error);
            throw new _common.BadRequestException('Failed to fetch sizes: ' + error.message);
        }
    }
    createSize({ value }) {
        return this.subCategoryService.createSize(value);
    }
    updateSize(size, { value }) {
        return this.subCategoryService.updateSize(size, value);
    }
    deleteSize(size) {
        return this.subCategoryService.deleteSize(size);
    }
    // Age group management
    async getAllAgeGroups() {
        try {
            console.log('Fetching all age groups from AgeGroup collection');
            const ageGroups = await this.ageGroupService.findAll();
            console.log('Age groups fetched:', ageGroups);
            return ageGroups;
        } catch (error) {
            console.error('Error fetching age groups:', error);
            throw new _common.BadRequestException('Failed to fetch age groups: ' + error.message);
        }
    }
    createAgeGroup(createAgeGroupDto) {
        return this.ageGroupService.create(createAgeGroupDto);
    }
    async updateAgeGroup(ageGroupName, updateAgeGroupDto) {
        try {
            // Decode URL-encoded Georgian text
            const decodedAgeGroupName = decodeURIComponent(ageGroupName);
            console.log('Updating age group:', {
                original: ageGroupName,
                decoded: decodedAgeGroupName
            });
            // Find the age group by name first
            const ageGroups = await this.ageGroupService.findAll();
            const existingAgeGroup = ageGroups.find((ag)=>ag.name === decodedAgeGroupName);
            if (!existingAgeGroup) {
                throw new _common.BadRequestException(`Age group with name "${decodedAgeGroupName}" not found`);
            }
            console.log('Found existing age group:', existingAgeGroup);
            // Update using the ObjectId (convert to string)
            return await this.ageGroupService.update(existingAgeGroup._id.toString(), updateAgeGroupDto);
        } catch (error) {
            console.error('Error updating age group:', error);
            if (error instanceof _common.BadRequestException) {
                throw error;
            }
            throw new _common.BadRequestException('Failed to update age group: ' + error.message);
        }
    }
    async deleteAgeGroup(ageGroupName) {
        try {
            // Decode URL-encoded Georgian text
            const decodedAgeGroupName = decodeURIComponent(ageGroupName);
            console.log('Deleting age group:', {
                original: ageGroupName,
                decoded: decodedAgeGroupName
            });
            // Find the age group by name first
            const ageGroups = await this.ageGroupService.findAll();
            const existingAgeGroup = ageGroups.find((ag)=>ag.name === decodedAgeGroupName);
            if (!existingAgeGroup) {
                throw new _common.BadRequestException(`Age group with name "${decodedAgeGroupName}" not found`);
            }
            // Delete using the ObjectId (convert to string)
            return await this.ageGroupService.remove(existingAgeGroup._id.toString());
        } catch (error) {
            console.error('Error deleting age group:', error);
            if (error instanceof _common.BadRequestException) {
                throw error;
            }
            throw new _common.BadRequestException('Failed to delete age group: ' + error.message);
        }
    }
    constructor(subCategoryService, colorService, ageGroupService){
        this.subCategoryService = subCategoryService;
        this.colorService = colorService;
        this.ageGroupService = ageGroupService;
    }
};
_ts_decorate([
    (0, _common.Get)('all'),
    (0, _swagger.ApiOperation)({
        summary: 'Get attribute options for categories'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns age groups, sizes, and colors'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "getAttributeOptions", null);
_ts_decorate([
    (0, _common.Get)('colors'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all available colors from Color collection'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all available colors with nameEn'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllColors", null);
_ts_decorate([
    (0, _common.Post)('colors'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new color'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The color has been created'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _colordto.CreateColorDto === "undefined" ? Object : _colordto.CreateColorDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "createColor", null);
_ts_decorate([
    (0, _common.Put)('colors/:color'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update a color name'
    }),
    (0, _swagger.ApiParam)({
        name: 'color',
        description: 'Color name to update'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The color has been updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Color not found'
    }),
    _ts_param(0, (0, _common.Param)('color')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _colordto.UpdateColorDto === "undefined" ? Object : _colordto.UpdateColorDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "updateColor", null);
_ts_decorate([
    (0, _common.Delete)('colors/:color'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a color'
    }),
    (0, _swagger.ApiParam)({
        name: 'color',
        description: 'Color name to delete'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The color has been deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Color not found'
    }),
    _ts_param(0, (0, _common.Param)('color')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "deleteColor", null);
_ts_decorate([
    (0, _common.Get)('sizes'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all available sizes from subcategories'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all available sizes',
        schema: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllSizes", null);
_ts_decorate([
    (0, _common.Post)('sizes'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new size'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The size has been created'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subcategorydto.AttributeDto === "undefined" ? Object : _subcategorydto.AttributeDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "createSize", null);
_ts_decorate([
    (0, _common.Put)('sizes/:size'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update a size name'
    }),
    (0, _swagger.ApiParam)({
        name: 'size',
        description: 'Size to update'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The size has been updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Size not found'
    }),
    _ts_param(0, (0, _common.Param)('size')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _subcategorydto.AttributeDto === "undefined" ? Object : _subcategorydto.AttributeDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "updateSize", null);
_ts_decorate([
    (0, _common.Delete)('sizes/:size'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a size'
    }),
    (0, _swagger.ApiParam)({
        name: 'size',
        description: 'Size to delete'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The size has been deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Size not found'
    }),
    _ts_param(0, (0, _common.Param)('size')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "deleteSize", null);
_ts_decorate([
    (0, _common.Get)('age-groups'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all available age groups from AgeGroup collection'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all available age groups with nameEn'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllAgeGroups", null);
_ts_decorate([
    (0, _common.Post)('age-groups'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new age group'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The age group has been created'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agegroupdto.CreateAgeGroupDto === "undefined" ? Object : _agegroupdto.CreateAgeGroupDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AttributesController.prototype, "createAgeGroup", null);
_ts_decorate([
    (0, _common.Put)('age-groups/:ageGroup'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update an age group name'
    }),
    (0, _swagger.ApiParam)({
        name: 'ageGroup',
        description: 'Age group to update'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The age group has been updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Age group not found'
    }),
    _ts_param(0, (0, _common.Param)('ageGroup')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _agegroupdto.UpdateAgeGroupDto === "undefined" ? Object : _agegroupdto.UpdateAgeGroupDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "updateAgeGroup", null);
_ts_decorate([
    (0, _common.Delete)('age-groups/:ageGroup'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete an age group'
    }),
    (0, _swagger.ApiParam)({
        name: 'ageGroup',
        description: 'Age group to delete'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The age group has been deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Age group not found'
    }),
    _ts_param(0, (0, _common.Param)('ageGroup')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AttributesController.prototype, "deleteAgeGroup", null);
AttributesController = _ts_decorate([
    (0, _swagger.ApiTags)('attributes'),
    (0, _common.Controller)('categories/attributes'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subCategoryservice.SubCategoryService === "undefined" ? Object : _subCategoryservice.SubCategoryService,
        typeof _colorservice.ColorService === "undefined" ? Object : _colorservice.ColorService,
        typeof _agegroupservice.AgeGroupService === "undefined" ? Object : _agegroupservice.AgeGroupService
    ])
], AttributesController);

//# sourceMappingURL=attributes.controller.js.map