"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CategoryResponseDto () {
        return CategoryResponseDto;
    },
    get CreateCategoryDto () {
        return CreateCategoryDto;
    },
    get UpdateCategoryDto () {
        return UpdateCategoryDto;
    }
});
const _classvalidator = require("class-validator");
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
let CategoryResponseDto = class CategoryResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category ID',
        example: '60d21b4667d0d8992e610c85'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name',
        example: 'ტანსაცმელი'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name in English',
        example: 'Clothing'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description',
        example: 'სხვადასხვა ტიპის ტანსაცმელი'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description in English',
        example: 'Various types of clothing'
    }),
    _ts_metadata("design:type", String)
], CategoryResponseDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is category active',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Creation date',
        example: '2023-06-20T12:00:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Last update date',
        example: '2023-06-20T12:00:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
let CreateCategoryDto = class CreateCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name',
        example: 'ტანსაცმელი'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name in English',
        example: 'Clothing',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateCategoryDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description',
        required: false,
        example: 'სხვადასხვა ტიპის ტანსაცმელი'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description in English',
        required: false,
        example: 'Various types of clothing'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateCategoryDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is category active',
        required: false,
        default: true
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "isActive", void 0);
let UpdateCategoryDto = class UpdateCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name',
        required: false,
        example: 'ტანსაცმელი'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name in English',
        required: false,
        example: 'Clothing'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description',
        required: false,
        example: 'სხვადასხვა ტიპის ტანსაცმელი'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description in English',
        required: false,
        example: 'Various types of clothing'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateCategoryDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is category active',
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateCategoryDto.prototype, "isActive", void 0);

//# sourceMappingURL=category.dto.js.map