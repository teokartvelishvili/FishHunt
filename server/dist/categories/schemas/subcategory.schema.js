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
    get SubCategory () {
        return SubCategory;
    },
    get SubCategorySchema () {
        return SubCategorySchema;
    }
});
const _mongoose = /*#__PURE__*/ _interop_require_wildcard(require("mongoose"));
const _mongoose1 = require("@nestjs/mongoose");
const _categoryschema = require("./category.schema");
const _swagger = require("@nestjs/swagger");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SubCategory = class SubCategory {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory ID (auto-generated)',
        example: '60d21b4667d0d8992e610c86'
    }),
    _ts_metadata("design:type", String)
], SubCategory.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name',
        example: 'მაისურები'
    }),
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], SubCategory.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory name in English',
        example: 'T-shirts'
    }),
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], SubCategory.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Parent category',
        example: '60d21b4667d0d8992e610c85'
    }),
    (0, _mongoose1.Prop)({
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }),
    _ts_metadata("design:type", typeof _categoryschema.Category === "undefined" ? Object : _categoryschema.Category)
], SubCategory.prototype, "categoryId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available age groups',
        example: [
            'ბავშვები',
            'მოზრდილები'
        ]
    }),
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], SubCategory.prototype, "ageGroups", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available sizes',
        example: [
            'S',
            'M',
            'L',
            'XL'
        ]
    }),
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], SubCategory.prototype, "sizes", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Available colors',
        example: [
            'შავი',
            'თეთრი',
            'წითელი'
        ]
    }),
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], SubCategory.prototype, "colors", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description',
        example: 'მაისურები ყველა სეზონისთვის'
    }),
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], SubCategory.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Subcategory description in English',
        example: 'T-shirts for all seasons'
    }),
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], SubCategory.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is subcategory active',
        default: true
    }),
    (0, _mongoose1.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], SubCategory.prototype, "isActive", void 0);
SubCategory = _ts_decorate([
    (0, _mongoose1.Schema)({
        timestamps: true
    })
], SubCategory);
const SubCategorySchema = _mongoose1.SchemaFactory.createForClass(SubCategory);
// Create compound index for unique subcategories within a category
SubCategorySchema.index({
    name: 1,
    categoryId: 1
}, {
    unique: true
});
// Ensure the virtual id field is properly included in serialization
SubCategorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

//# sourceMappingURL=subcategory.schema.js.map