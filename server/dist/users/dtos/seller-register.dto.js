"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SellerRegisterDto", {
    enumerable: true,
    get: function() {
        return SellerRegisterDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
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
let SellerRegisterDto = class SellerRegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'ციფრული სამყარო',
        description: 'მაღაზიის სახელი'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "storeName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'მაღაზიის ლოგოს ფაილი',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File)
], SellerRegisterDto.prototype, "logoFile", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'https://example.com/logo.png',
        description: 'მაღაზიის ლოგოს URL მისამართი',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "storeLogo", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'გიორგი',
        description: 'მფლობელის სახელი'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "ownerFirstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'გიორგაძე',
        description: 'მფლობელის გვარი'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "ownerLastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '+995555123456',
        description: 'ტელეფონის ნომერი საერთაშორისო ფორმატში'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsPhoneNumber)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "phoneNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'example@mail.com',
        description: 'ელ-ფოსტის მისამართი'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.toLowerCase().trim() : value),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Password123!',
        description: 'პაროლი (მინიმუმ 6 და მაქსიმუმ 20 სიმბოლო)'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'პაროლი არ უნდა აღემატებოდეს 20 სიმბოლოს'
    }),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '01024085800',
        description: 'პირადი ნომერი'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "identificationNumber", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'GE29TB7777777777777777',
        description: 'საბანკო ანგარიშის ნომერი IBAN ფორმატში'
    }),
    (0, _classtransformer.Transform)(({ value })=>typeof value === 'string' ? value.trim() : value),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SellerRegisterDto.prototype, "accountNumber", void 0);

//# sourceMappingURL=seller-register.dto.js.map