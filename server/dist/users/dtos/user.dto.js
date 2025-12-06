"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserDto", {
    enumerable: true,
    get: function() {
        return UserDto;
    }
});
const _classtransformer = require("class-transformer");
const _mongoose = require("mongoose");
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
let UserDto = class UserDto {
};
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], UserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    (0, _classtransformer.Transform)(({ key, obj })=>obj[key]),
    _ts_metadata("design:type", typeof _mongoose.ObjectId === "undefined" ? Object : _mongoose.ObjectId)
], UserDto.prototype, "_id", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], UserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", typeof _roleenum.Role === "undefined" ? Object : _roleenum.Role)
], UserDto.prototype, "role", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", String)
], UserDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserDto.prototype, "updatedAt", void 0);

//# sourceMappingURL=user.dto.js.map