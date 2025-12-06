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
    get Color () {
        return Color;
    },
    get ColorSchema () {
        return ColorSchema;
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
let Color = class Color {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Color ID (auto-generated)',
        example: '60d21b4667d0d8992e610c88'
    }),
    _ts_metadata("design:type", String)
], Color.prototype, "_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Color name',
        example: 'წითელი'
    }),
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Color.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Color name in English',
        example: 'Red'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Color.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Color hex code',
        example: '#FF0000'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Color.prototype, "hexCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Color description',
        example: 'მკვეთრი წითელი'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Color.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is color active',
        default: true
    }),
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Color.prototype, "isActive", void 0);
Color = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Color);
const ColorSchema = _mongoose.SchemaFactory.createForClass(Color);

//# sourceMappingURL=color.schema.js.map