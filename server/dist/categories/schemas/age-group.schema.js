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
    get AgeGroup () {
        return AgeGroup;
    },
    get AgeGroupSchema () {
        return AgeGroupSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
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
let AgeGroup = class AgeGroup {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group ID (auto-generated)',
        example: '60d21b4667d0d8992e610c89'
    }),
    _ts_metadata("design:type", String)
], AgeGroup.prototype, "_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name',
        example: 'ბავშვები'
    }),
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], AgeGroup.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group name in English',
        example: 'Children'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], AgeGroup.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age range description',
        example: '3-12 წელი'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], AgeGroup.prototype, "ageRange", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Age group description',
        example: 'ბავშვები 3-დან 12 წლამდე'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], AgeGroup.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is age group active',
        default: true
    }),
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], AgeGroup.prototype, "isActive", void 0);
AgeGroup = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], AgeGroup);
const AgeGroupSchema = _mongoose.SchemaFactory.createForClass(AgeGroup);

//# sourceMappingURL=age-group.schema.js.map