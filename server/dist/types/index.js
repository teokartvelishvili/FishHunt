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
    get MainCategory () {
        return MainCategory;
    },
    get ProductStatus () {
        return ProductStatus;
    }
});
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
var ProductStatus = /*#__PURE__*/ function(ProductStatus) {
    ProductStatus["PENDING"] = "PENDING";
    ProductStatus["APPROVED"] = "APPROVED";
    ProductStatus["REJECTED"] = "REJECTED";
    return ProductStatus;
}({});

//# sourceMappingURL=index.js.map