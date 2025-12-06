"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResetPasswordDto", {
    enumerable: true,
    get: function() {
        return ResetPasswordDto;
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
let ResetPasswordDto = class ResetPasswordDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Password reset token received via email',
        example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'New password',
        example: 'newSecurePassword123',
        minLength: 6
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(6),
    _ts_metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);

//# sourceMappingURL=reset-password.dto.js.map