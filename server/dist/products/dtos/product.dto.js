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
    get FindAllProductsDto () {
        return FindAllProductsDto;
    },
    get ProductDto () {
        return ProductDto;
    }
});
const _classvalidator = require("class-validator");
const _productschema = require("../schemas/product.schema");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CategoryStructureDto = class CategoryStructureDto {
};
_ts_decorate([
    (0, _classvalidator.IsEnum)(_productschema.MainCategory),
    _ts_metadata("design:type", typeof _productschema.MainCategory === "undefined" ? Object : _productschema.MainCategory)
], CategoryStructureDto.prototype, "main", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CategoryStructureDto.prototype, "sub", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CategoryStructureDto.prototype, "subEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_productschema.AgeGroup),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productschema.AgeGroup === "undefined" ? Object : _productschema.AgeGroup)
], CategoryStructureDto.prototype, "ageGroup", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CategoryStructureDto.prototype, "size", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CategoryStructureDto.prototype, "color", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CategoryStructureDto.prototype, "colorEn", void 0);
let ProductVariantDto = class ProductVariantDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ProductVariantDto.prototype, "size", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ProductVariantDto.prototype, "color", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductVariantDto.prototype, "colorEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ProductVariantDto.prototype, "stock", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductVariantDto.prototype, "sku", void 0);
let ProductDto = class ProductDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ProductDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ProductDto.prototype, "discountPercentage", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductDto.prototype, "discountStartDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProductDto.prototype, "discountEndDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "videoDescription", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "hashtags", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "images", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "brand", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsMongoId)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "mainCategory", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "mainCategoryEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsMongoId)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "subCategory", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "subCategoryEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "ageGroups", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "sizes", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "colors", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "colorsEn", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>CategoryStructureDto),
    _ts_metadata("design:type", typeof CategoryStructureDto === "undefined" ? Object : CategoryStructureDto)
], ProductDto.prototype, "categoryStructure", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ProductDto.prototype, "countInStock", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ProductVariantDto),
    _ts_metadata("design:type", Array)
], ProductDto.prototype, "variants", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "brandLogo", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_productschema.ProductStatus),
    _ts_metadata("design:type", typeof _productschema.ProductStatus === "undefined" ? Object : _productschema.ProductStatus)
], ProductDto.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "rejectionReason", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_productschema.DeliveryType),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _productschema.DeliveryType === "undefined" ? Object : _productschema.DeliveryType)
], ProductDto.prototype, "deliveryType", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ProductDto.prototype, "minDeliveryDays", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ProductDto.prototype, "maxDeliveryDays", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], ProductDto.prototype, "dimensions", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "brandLogoUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ProductDto.prototype, "existingImages", void 0);
let FindAllProductsDto = class FindAllProductsDto {
} // We already have the correct DTO definitions with IsMongoId() decorators for mainCategory and subCategory
 // Just ensure they're properly transformed to ObjectIds in the service
;
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "keyword", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "page", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsMongoId)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "mainCategory", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsMongoId)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "subCategory", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "brand", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "sortBy", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "sortOrder", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "ageGroup", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "size", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "color", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindAllProductsDto.prototype, "includeVariants", void 0);

//# sourceMappingURL=product.dto.js.map