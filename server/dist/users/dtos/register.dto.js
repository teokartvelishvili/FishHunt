"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegisterDto", {
    enumerable: true,
    get: function() {
        return RegisterDto;
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
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John Doe',
        minLength: 4,
        maxLength: 20
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(4, {
        message: 'Username is too short.'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'Username is too long.'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'john@example.com'
    }),
    (0, _classtransformer.Transform)(({ value })=>value.toLowerCase()),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email address is not valid.'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        minLength: 5,
        maxLength: 20
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(5, {
        message: 'Password is too short.'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'Password is too long.'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);

//# sourceMappingURL=register.dto.js.map