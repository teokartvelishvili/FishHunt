"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubCategoriesController", {
    enumerable: true,
    get: function() {
        return SubCategoriesController;
    }
});
const _common = require("@nestjs/common");
const _subCategoryservice = require("../services/subCategory.service");
const _subcategorydto = require("../dto/subcategory.dto");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _rolesguard = require("../../guards/roles.guard");
const _roleenum = require("../../types/role.enum");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _swagger = require("@nestjs/swagger");
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
let SubCategoriesController = class SubCategoriesController {
    findAllSubCategories(categoryId, includeInactive) {
        console.log(`[SubCategoriesController] GET /categories/sub request. Query params -> categoryId: "${categoryId}", includeInactive: "${includeInactive}"`);
        try {
            // The service method is async, so this will return a Promise
            const subcategoriesPromise = this.subCategoryService.findAll(categoryId, includeInactive === 'true');
            console.log(`[SubCategoriesController] Called subCategoryService.findAll for categoryId: "${categoryId}"`);
            return subcategoriesPromise;
        } catch (error) {
            console.error(`[SubCategoriesController] Error in findAllSubCategories for categoryId: "${categoryId}":`, error.message, error.stack);
            throw error; // Rethrow to let NestJS handle the HTTP response
        }
    }
    findSubCategoryById(id) {
        return this.subCategoryService.findById(id);
    }
    createSubCategory(createSubCategoryDto) {
        return this.subCategoryService.create(createSubCategoryDto);
    }
    updateSubCategory(id, updateSubCategoryDto) {
        return this.subCategoryService.update(id, updateSubCategoryDto);
    }
    removeSubCategory(id) {
        return this.subCategoryService.remove(id);
    }
    constructor(subCategoryService){
        this.subCategoryService = subCategoryService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all subcategories'
    }),
    (0, _swagger.ApiQuery)({
        name: 'categoryId',
        required: false,
        description: 'Filter by category ID'
    }),
    (0, _swagger.ApiQuery)({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Include inactive subcategories'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all subcategories'
    }),
    _ts_param(0, (0, _common.Query)('categoryId')),
    _ts_param(1, (0, _common.Query)('includeInactive')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SubCategoriesController.prototype, "findAllSubCategories", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get subcategory by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Subcategory ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the subcategory'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Subcategory not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SubCategoriesController.prototype, "findSubCategoryById", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new subcategory'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The subcategory has been created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid data or duplicate subcategory'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Category not found'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subcategorydto.CreateSubCategoryDto === "undefined" ? Object : _subcategorydto.CreateSubCategoryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SubCategoriesController.prototype, "createSubCategory", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update a subcategory'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Subcategory ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The subcategory has been updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Subcategory not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _subcategorydto.UpdateSubCategoryDto === "undefined" ? Object : _subcategorydto.UpdateSubCategoryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SubCategoriesController.prototype, "updateSubCategory", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a subcategory'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Subcategory ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The subcategory has been deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Subcategory not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SubCategoriesController.prototype, "removeSubCategory", null);
SubCategoriesController = _ts_decorate([
    (0, _swagger.ApiTags)('subcategories'),
    (0, _common.Controller)('subcategories'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subCategoryservice.SubCategoryService === "undefined" ? Object : _subCategoryservice.SubCategoryService
    ])
], SubCategoriesController);

//# sourceMappingURL=subcategories.controller.js.map