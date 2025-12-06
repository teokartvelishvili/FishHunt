"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminProfileDto", {
    enumerable: true,
    get: function() {
        return AdminProfileDto;
    }
});
const _roleenum = require("../../types/role.enum");
const _classvalidator = require("class-validator");
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
let AdminProfileDto = class AdminProfileDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(4, {
        message: 'Username is too short.'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'Username is too long.'
    }),
    _ts_metadata("design:type", String)
], AdminProfileDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email address is not valid.'
    }),
    _ts_metadata("design:type", String)
], AdminProfileDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'Password is too short.'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'Password is too long.'
    }),
    _ts_metadata("design:type", String)
], AdminProfileDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_roleenum.Role),
    (0, _classtransformer.Transform)(({ value })=>value),
    _ts_metadata("design:type", typeof _roleenum.Role === "undefined" ? Object : _roleenum.Role)
], AdminProfileDto.prototype, "role", void 0);

//# sourceMappingURL=admin.profile.dto.js.map