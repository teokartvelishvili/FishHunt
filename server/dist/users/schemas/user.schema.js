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
    get User () {
        return User;
    },
    get UserSchema () {
        return UserSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
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
let User = class User {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], User.prototype, "password", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        unique: true,
        sparse: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "googleId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        enum: _roleenum.Role,
        default: _roleenum.Role.User
    }),
    _ts_metadata("design:type", typeof _roleenum.Role === "undefined" ? Object : _roleenum.Role)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "storeName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "storeLogo", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "ownerFirstName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "ownerLastName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "identificationNumber", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "accountNumber", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "passwordResetExpires", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        default: null
    }),
    _ts_metadata("design:type", String)
], User.prototype, "profileImagePath", void 0);
User = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true,
        toJSON: {
            transform: (_, ret)=>{
                ret.id = ret._id;
                delete ret.__v;
                delete ret.password;
                ret.createdAt = ret.createdAt;
            }
        }
    })
], User);
const UserSchema = _mongoose.SchemaFactory.createForClass(User);
UserSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

//# sourceMappingURL=user.schema.js.map