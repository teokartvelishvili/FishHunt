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
    get AGE_GROUPS () {
        return _subcategories.AGE_GROUPS;
    },
    get COLORS () {
        return _subcategories.COLORS;
    },
    get DEFAULT_CATEGORY_STRUCTURE () {
        return DEFAULT_CATEGORY_STRUCTURE;
    },
    get MAIN_CATEGORIES () {
        return MAIN_CATEGORIES;
    },
    get SIZES () {
        return _subcategories.SIZES;
    }
});
const _subcategories = require("../utils/subcategories");
const DEFAULT_CATEGORY_STRUCTURE = {
    ageGroups: _subcategories.AGE_GROUPS,
    sizes: _subcategories.SIZES,
    colors: _subcategories.COLORS
};
const MAIN_CATEGORIES = [
    {
        code: 'CLOTHING',
        name: 'ტანსაცმელი',
        subcategories: _subcategories.CLOTHING_CATEGORIES
    },
    {
        code: 'ACCESSORIES',
        name: 'აქსესუარები',
        subcategories: _subcategories.ACCESSORIES_CATEGORIES
    },
    {
        code: 'FOOTWEAR',
        name: 'ფეხსაცმელი',
        subcategories: _subcategories.FOOTWEAR_CATEGORIES
    },
    {
        code: 'SWIMWEAR',
        name: 'საცურაო კოსტუმები',
        subcategories: _subcategories.SWIMWEAR_CATEGORIES
    }
];

//# sourceMappingURL=categories.constants.js.map