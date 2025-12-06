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
    get AuthResponseDto () {
        return AuthResponseDto;
    },
    get LoginDto () {
        return LoginDto;
    },
    get TokensDto () {
        return TokensDto;
    },
    get UserResponseDto () {
        return UserResponseDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _roleenum = require("../../types/role.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'john@example.com'
    }),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let TokensDto = class TokensDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], TokensDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], TokensDto.prototype, "refreshToken", void 0);
let UserResponseDto = class UserResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _roleenum.Role,
        required: false
    }),
    _ts_metadata("design:type", typeof _roleenum.Role === "undefined" ? Object : _roleenum.Role)
], UserResponseDto.prototype, "role", void 0);
let AuthResponseDto = class AuthResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: ()=>TokensDto
    }),
    _ts_metadata("design:type", typeof TokensDto === "undefined" ? Object : TokensDto)
], AuthResponseDto.prototype, "tokens", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: ()=>UserResponseDto
    }),
    _ts_metadata("design:type", typeof UserResponseDto === "undefined" ? Object : UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);

//# sourceMappingURL=auth.dto.js.map