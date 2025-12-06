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
    get ACCESSORIES_CATEGORIES () {
        return ACCESSORIES_CATEGORIES;
    },
    get AGE_GROUPS () {
        return AGE_GROUPS;
    },
    get CATEGORY_MAPPING () {
        return CATEGORY_MAPPING;
    },
    get CLOTHING_CATEGORIES () {
        return CLOTHING_CATEGORIES;
    },
    get COLORS () {
        return COLORS;
    },
    get FOOTWEAR_CATEGORIES () {
        return FOOTWEAR_CATEGORIES;
    },
    get HANDMADE_CATEGORIES () {
        return HANDMADE_CATEGORIES;
    },
    get PAINTING_CATEGORIES () {
        return PAINTING_CATEGORIES;
    },
    get SIZES () {
        return SIZES;
    },
    get SWIMWEAR_CATEGORIES () {
        return SWIMWEAR_CATEGORIES;
    }
});
const CLOTHING_CATEGORIES = [
    'მაისურები',
    'კაბები',
    'ჰუდები',
    'სხვა'
];
const ACCESSORIES_CATEGORIES = [
    'კეპები',
    'პანამები',
    'სხვა'
];
const FOOTWEAR_CATEGORIES = [
    'სპორტული',
    'ყოველდღიური',
    'სხვა'
];
const SWIMWEAR_CATEGORIES = [
    'საცურაო კოსტუმები',
    'სხვა'
];
const AGE_GROUPS = [
    'ბავშვები',
    'მოზრდილები'
];
const SIZES = {
    CLOTHING: [
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL'
    ],
    FOOTWEAR: [
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45'
    ],
    ACCESSORIES: [
        'უნივერსალური',
        'S',
        'M',
        'L'
    ],
    SWIMWEAR: [
        'XS',
        'S',
        'M',
        'L',
        'XL'
    ]
};
const COLORS = [
    'შავი',
    'თეთრი',
    'წითელი',
    'ლურჯი',
    'მწვანე',
    'ყვითელი',
    'ნაცრისფერი',
    'ვარდისფერი',
    'იისფერი',
    'ყავისფერი',
    'ნარინჯისფერი',
    'სხვა'
];
const HANDMADE_CATEGORIES = [
    'კერამიკა',
    'ხის ნაკეთობები',
    'სამკაულები',
    'ტექსტილი',
    'მინანქარი',
    'სკულპტურები',
    'სხვა'
];
const PAINTING_CATEGORIES = [
    'აბსტრაქცია',
    'პეიზაჟი',
    'პორტრეტი',
    'შავ-თეთრი',
    'ანიმაციური',
    'ციფრული ილუსტრაციები',
    'მინიატურა',
    'სხვა'
];
const CATEGORY_MAPPING = {
    // Map HANDMADE categories to ACCESSORIES
    კერამიკა: 'კეპები',
    'ხის ნაკეთობები': 'პანამები',
    სამკაულები: 'სხვა',
    ტექსტილი: 'სხვა',
    მინანქარი: 'სხვა',
    სკულპტურები: 'სხვა',
    // Map PAINTINGS categories to CLOTHING
    აბსტრაქცია: 'მაისურები',
    პეიზაჟი: 'მაისურები',
    პორტრეტი: 'მაისურები',
    'შავ-თეთრი': 'მაისურები',
    ანიმაციური: 'მაისურები',
    'ციფრული ილუსტრაციები': 'მაისურები',
    მინიატურა: 'მაისურები'
};

//# sourceMappingURL=subcategories.js.map