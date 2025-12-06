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
    get CreateSizeDto () {
        return CreateSizeDto;
    },
    get UpdateSizeDto () {
        return UpdateSizeDto;
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
let CreateSizeDto = class CreateSizeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size value',
        example: 'XL'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSizeDto.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size category',
        example: 'CLOTHING',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSizeDto.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size description',
        example: 'Extra Large',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSizeDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is size active',
        default: true,
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateSizeDto.prototype, "isActive", void 0);
let UpdateSizeDto = class UpdateSizeDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size value',
        example: 'XL',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSizeDto.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size category',
        example: 'CLOTHING',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSizeDto.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size description',
        example: 'Extra Large',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateSizeDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is size active',
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateSizeDto.prototype, "isActive", void 0);

//# sourceMappingURL=size.dto.js.map