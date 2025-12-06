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
    get DeliveryType () {
        return DeliveryType;
    },
    get MainCategory () {
        return MainCategory;
    },
    get Product () {
        return Product;
    },
    get ProductSchema () {
        return ProductSchema;
    },
    get ProductStatus () {
        return ProductStatus;
    },
    get ProductVariant () {
        return ProductVariant;
    },
    get ProductVariantSchema () {
        return ProductVariantSchema;
    },
    get Review () {
        return Review;
    }
});
const _mongoose = /*#__PURE__*/ _interop_require_wildcard(require("mongoose"));
const _mongoose1 = require("@nestjs/mongoose");
const _userschema = require("../../users/schemas/user.schema");
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
let Review = class Review {
};
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: _mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        default: null
    }),
    _ts_metadata("design:type", typeof _userschema.User === "undefined" ? Object : _userschema.User)
], Review.prototype, "user", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Review.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], Review.prototype, "rating", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Review.prototype, "comment", void 0);
Review = _ts_decorate([
    (0, _mongoose1.Schema)({
        timestamps: true
    })
], Review);
var ProductStatus = /*#__PURE__*/ function(ProductStatus) {
    ProductStatus["PENDING"] = "PENDING";
    ProductStatus["APPROVED"] = "APPROVED";
    ProductStatus["REJECTED"] = "REJECTED";
    return ProductStatus;
}({});
var DeliveryType = /*#__PURE__*/ function(DeliveryType) {
    DeliveryType["SELLER"] = "SELLER";
    DeliveryType["FishHunt"] = "FishHunt";
    return DeliveryType;
}({});
var MainCategory = /*#__PURE__*/ function(MainCategory) {
    MainCategory["CLOTHING"] = "CLOTHING";
    MainCategory["ACCESSORIES"] = "ACCESSORIES";
    MainCategory["FOOTWEAR"] = "FOOTWEAR";
    MainCategory["SWIMWEAR"] = "SWIMWEAR";
    return MainCategory;
}({});
var AgeGroup = /*#__PURE__*/ function(AgeGroup) {
    AgeGroup["ADULTS"] = "ADULTS";
    AgeGroup["KIDS"] = "KIDS";
    return AgeGroup;
}({});
let ProductVariant = class ProductVariant {
};
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProductVariant.prototype, "size", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProductVariant.prototype, "color", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProductVariant.prototype, "colorEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProductVariant.prototype, "ageGroup", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
ProductVariant = _ts_decorate([
    (0, _mongoose1.Schema)()
], ProductVariant);
const ProductVariantSchema = _mongoose1.SchemaFactory.createForClass(ProductVariant);
let Product = class Product {
};
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: _mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        default: null
    }),
    _ts_metadata("design:type", typeof _userschema.User === "undefined" ? Object : _userschema.User)
], Product.prototype, "user", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "brand", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({}),
    _ts_metadata("design:type", String)
], Product.prototype, "brandLogo", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "category", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }),
    _ts_metadata("design:type", Object)
], Product.prototype, "mainCategory", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)(),
    _ts_metadata("design:type", String)
], Product.prototype, "mainCategoryEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }),
    _ts_metadata("design:type", Object)
], Product.prototype, "subCategory", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)(),
    _ts_metadata("design:type", String)
], Product.prototype, "subCategoryEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "ageGroups", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "sizes", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "colors", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "colorsEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Object
    }),
    _ts_metadata("design:type", typeof CategoryStructure === "undefined" ? Object : CategoryStructure)
], Product.prototype, "categoryStructure", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "images", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "descriptionEn", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "videoDescription", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "hashtags", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "rating", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "numReviews", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "price", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Number,
        min: 0,
        max: 100
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "discountPercentage", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Date
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Product.prototype, "discountStartDate", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Date
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Product.prototype, "discountEndDate", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "countInStock", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: [
            ProductVariantSchema
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Product.prototype, "variants", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        required: true,
        default: "PENDING"
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "status", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: String
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "rejectionReason", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: String,
        enum: DeliveryType,
        default: "FishHunt"
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "deliveryType", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "minDeliveryDays", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Product.prototype, "maxDeliveryDays", void 0);
_ts_decorate([
    (0, _mongoose1.Prop)({
        type: Object
    }),
    _ts_metadata("design:type", Object)
], Product.prototype, "dimensions", void 0);
Product = _ts_decorate([
    (0, _mongoose1.Schema)({
        timestamps: true,
        autoIndex: false
    })
], Product);
const ProductSchema = _mongoose1.SchemaFactory.createForClass(Product);
// Disable automatic index creation to prevent duplicates
ProductSchema.set('autoIndex', false);
// Create indexes manually with proper configuration
// Note: autoIndex is disabled to prevent duplicate indexes
// Create composite index for efficient category-based queries
ProductSchema.index({
    mainCategory: 1,
    subCategory: 1
}, {
    background: true,
    sparse: true
});
// Individual indexes for common queries
ProductSchema.index({
    brand: 1
}, {
    background: true,
    sparse: true
});
ProductSchema.index({
    status: 1
}, {
    background: true
});
// Note: createdAt index is automatically created by timestamps: true
// Array field indexes (created individually to avoid parallel array indexing)
ProductSchema.index({
    ageGroups: 1
}, {
    background: true,
    sparse: true
});
ProductSchema.index({
    sizes: 1
}, {
    background: true,
    sparse: true
});
ProductSchema.index({
    colors: 1
}, {
    background: true,
    sparse: true
});

//# sourceMappingURL=product.schema.js.map