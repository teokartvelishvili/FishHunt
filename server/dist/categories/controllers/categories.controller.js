"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoriesController", {
    enumerable: true,
    get: function() {
        return CategoriesController;
    }
});
const _common = require("@nestjs/common");
const _categoryservice = require("../services/category.service");
const _categorydto = require("../dto/category.dto");
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
let CategoriesController = class CategoriesController {
    // Main category endpoints only
    findAllCategories(includeInactive) {
        return this.categoryService.findAll(includeInactive === 'true');
    }
    findCategoryById(id) {
        return this.categoryService.findById(id);
    }
    createCategory(createCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
    updateCategory(id, updateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }
    removeCategory(id) {
        return this.categoryService.remove(id);
    }
    constructor(categoryService){
        this.categoryService = categoryService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all categories'
    }),
    (0, _swagger.ApiQuery)({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Include inactive categories'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all categories',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85'
                    },
                    name: {
                        type: 'string',
                        example: 'ტანსაცმელი'
                    },
                    description: {
                        type: 'string',
                        example: 'სხვადასხვა ტიპის ტანსაცმელი'
                    },
                    isActive: {
                        type: 'boolean',
                        example: true
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-06-20T12:00:00Z'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-06-20T12:00:00Z'
                    }
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Query)('includeInactive')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAllCategories", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get category by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Category ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the category',
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c85'
                },
                name: {
                    type: 'string',
                    example: 'ტანსაცმელი'
                },
                description: {
                    type: 'string',
                    example: 'სხვადასხვა ტიპის ტანსაცმელი'
                },
                isActive: {
                    type: 'boolean',
                    example: true
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-06-20T12:00:00Z'
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-06-20T12:00:00Z'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Category not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CategoriesController.prototype, "findCategoryById", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new category'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The category has been created',
        type: _categorydto.CategoryResponseDto
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _categorydto.CreateCategoryDto === "undefined" ? Object : _categorydto.CreateCategoryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], CategoriesController.prototype, "createCategory", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update a category'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Category ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The category has been updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Category not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _categorydto.UpdateCategoryDto === "undefined" ? Object : _categorydto.UpdateCategoryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], CategoriesController.prototype, "updateCategory", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a category'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Category ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'The category has been deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Category not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], CategoriesController.prototype, "removeCategory", null);
CategoriesController = _ts_decorate([
    (0, _swagger.ApiTags)('categories'),
    (0, _common.Controller)('categories'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _categoryservice.CategoryService === "undefined" ? Object : _categoryservice.CategoryService
    ])
], CategoriesController);

//# sourceMappingURL=categories.controller.js.map