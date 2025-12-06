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
    get CreateAgeGroupDto () {
        return CreateAgeGroupDto;
    },
    get UpdateAgeGroupDto () {
        return UpdateAgeGroupDto;
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
let CreateAgeGroupDto = class CreateAgeGroupDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name',
        example: 'ბავშვები'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateAgeGroupDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name in English',
        example: 'Children',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateAgeGroupDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age range description',
        example: '3-12 წელი',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateAgeGroupDto.prototype, "ageRange", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group description',
        example: 'ბავშვები 3-დან 12 წლამდე',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateAgeGroupDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is age group active',
        default: true,
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateAgeGroupDto.prototype, "isActive", void 0);
let UpdateAgeGroupDto = class UpdateAgeGroupDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name',
        example: 'ბავშვები',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateAgeGroupDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name in English',
        example: 'Children',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateAgeGroupDto.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age range description',
        example: '3-12 წელი',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateAgeGroupDto.prototype, "ageRange", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group description',
        example: 'ბავშვები 3-დან 12 წლამდე',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateAgeGroupDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is age group active',
        required: false
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateAgeGroupDto.prototype, "isActive", void 0);

//# sourceMappingURL=age-group.dto.js.map