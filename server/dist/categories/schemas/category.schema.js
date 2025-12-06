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
    get Category () {
        return Category;
    },
    get CategorySchema () {
        return CategorySchema;
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
let Category = class Category {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category ID (auto-generated)',
        example: '60d21b4667d0d8992e610c85'
    }),
    _ts_metadata("design:type", String)
], Category.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name',
        example: 'ტანსაცმელი'
    }),
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Category.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category name in English',
        example: 'Clothing'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Category.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description',
        example: 'სხვადასხვა ტიპის ტანსაცმელი'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Category.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Category description in English',
        example: 'Various types of clothing'
    }),
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Category.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is category active',
        default: true
    }),
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Category.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Creation date',
        example: '2023-06-20T12:00:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Category.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Last update date',
        example: '2023-06-20T12:00:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Category.prototype, "updatedAt", void 0);
Category = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    })
], Category);
const CategorySchema = _mongoose.SchemaFactory.createForClass(Category);
// Ensure the virtual id field is properly included in serialization
CategorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
// Add a pre-save hook to remove any unexpected fields
CategorySchema.pre('save', function(next) {
    // Ensure only allowed fields are saved
    const allowedFields = [
        'name',
        'nameEn',
        'description',
        'descriptionEn',
        'isActive'
    ];
    // Get all fields in the document
    const documentFields = Object.keys(this.toObject());
    // Remove any fields that aren't in allowedFields and aren't MongoDB internal fields
    documentFields.forEach((field)=>{
        if (!allowedFields.includes(field) && !field.startsWith('_') && field !== 'createdAt' && field !== 'updatedAt') {
            // @ts-ignore - dynamically remove unexpected fields
            this[field] = undefined;
        }
    });
    next();
});

//# sourceMappingURL=category.schema.js.map