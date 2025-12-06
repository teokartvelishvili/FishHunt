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
    get AttributeDto () {
        return AttributeDto;
    },
    get AttributesArrayDto () {
        return AttributesArrayDto;
    },
    get CreateSubCategoryDto () {
        return CreateSubCategoryDto;
    },
    get UpdateSubCategoryDto () {
        return UpdateSubCategoryDto;
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
let CreateSubCategoryDto = class CreateSubCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name',
        example: 'მაისურები'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name in English',
        example: 'T-shirts',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Parent category ID',
        example: '60d21b4667d0d8992e610c85'
    }),
    (0, _classvalidator.IsMongoId)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available age groups',
        required: false,
        example: [
            'ბავშვები',
            'მოზრდილები'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateSubCategoryDto.prototype, "ageGroups", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available sizes',
        required: false,
        example: [
            'S',
            'M',
            'L',
            'XL'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateSubCategoryDto.prototype, "sizes", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available colors',
        required: false,
        example: [
            'შავი',
            'თეთრი',
            'წითელი'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateSubCategoryDto.prototype, "colors", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description',
        required: false,
        example: 'მაისურები ყველა სეზონისთვის'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description in English',
        required: false,
        example: 'T-shirts for all seasons'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSubCategoryDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is subcategory active',
        required: false,
        default: true
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateSubCategoryDto.prototype, "isActive", void 0);
let UpdateSubCategoryDto = class UpdateSubCategoryDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name',
        required: false,
        example: 'მაისურები'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name in English',
        required: false,
        example: 'T-shirts'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Parent category ID',
        required: false,
        example: '60d21b4667d0d8992e610c85'
    }),
    (0, _classvalidator.IsMongoId)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available age groups',
        required: false,
        example: [
            'ბავშვები',
            'მოზრდილები'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], UpdateSubCategoryDto.prototype, "ageGroups", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available sizes',
        required: false,
        example: [
            'S',
            'M',
            'L',
            'XL'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], UpdateSubCategoryDto.prototype, "sizes", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available colors',
        required: false,
        example: [
            'შავი',
            'თეთრი',
            'წითელი'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], UpdateSubCategoryDto.prototype, "colors", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description',
        required: false,
        example: 'მაისურები ყველა სეზონისთვის'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description in English',
        required: false,
        example: 'T-shirts for all seasons'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSubCategoryDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is subcategory active',
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateSubCategoryDto.prototype, "isActive", void 0);
let AttributeDto = class AttributeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Attribute value',
        example: 'წითელი'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AttributeDto.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Attribute value in English',
        example: 'Red',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], AttributeDto.prototype, "nameEn", void 0);
let AttributesArrayDto = class AttributesArrayDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Array of attribute values',
        example: [
            'წითელი',
            'ლურჯი',
            'შავი'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], AttributesArrayDto.prototype, "values", void 0);

//# sourceMappingURL=subcategory.dto.js.map