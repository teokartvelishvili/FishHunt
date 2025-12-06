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
    get Size () {
        return Size;
    },
    get SizeSchema () {
        return SizeSchema;
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
let Size = class Size {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size ID (auto-generated)',
        example: '60d21b4667d0d8992e610c87'
    }),
    _ts_metadata("design:type", String)
], Size.prototype, "_id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size value',
        example: 'XL'
    }),
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Size.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size category (e.g., CLOTHING, FOOTWEAR)',
        example: 'CLOTHING'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Size.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Size description',
        example: 'Extra Large'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Size.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is size active',
        default: true
    }),
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Size.prototype, "isActive", void 0);
Size = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Size);
const SizeSchema = _mongoose.SchemaFactory.createForClass(Size);

//# sourceMappingURL=size.schema.js.map