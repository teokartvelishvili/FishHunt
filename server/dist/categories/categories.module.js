"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoriesModule", {
    enumerable: true,
    get: function() {
        return CategoriesModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _categoriescontroller = require("./controllers/categories.controller");
const _subcategoriescontroller = require("./controllers/subcategories.controller");
const _attributescontroller = require("./controllers/attributes.controller");
const _categoryservice = require("./services/category.service");
const _subCategoryservice = require("./services/subCategory.service");
const _categoryschema = require("./schemas/category.schema");
const _subcategoryschema = require("./schemas/subcategory.schema");
const _colorschema = require("./schemas/color.schema");
const _sizeschema = require("./schemas/size.schema");
const _agegroupschema = require("./schemas/age-group.schema");
const _colorservice = require("./services/color.service");
const _sizeservice = require("./services/size.service");
const _agegroupservice = require("./services/age-group.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CategoriesModule = class CategoriesModule {
};
CategoriesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _categoryschema.Category.name,
                    schema: _categoryschema.CategorySchema
                },
                {
                    name: _subcategoryschema.SubCategory.name,
                    schema: _subcategoryschema.SubCategorySchema
                },
                {
                    name: _colorschema.Color.name,
                    schema: _colorschema.ColorSchema
                },
                {
                    name: _sizeschema.Size.name,
                    schema: _sizeschema.SizeSchema
                },
                {
                    name: _agegroupschema.AgeGroup.name,
                    schema: _agegroupschema.AgeGroupSchema
                }
            ])
        ],
        controllers: [
            _categoriescontroller.CategoriesController,
            _subcategoriescontroller.SubCategoriesController,
            _attributescontroller.AttributesController
        ],
        providers: [
            _categoryservice.CategoryService,
            _subCategoryservice.SubCategoryService,
            _colorservice.ColorService,
            _sizeservice.SizeService,
            _agegroupservice.AgeGroupService
        ],
        exports: [
            _categoryservice.CategoryService,
            _subCategoryservice.SubCategoryService,
            _colorservice.ColorService,
            _sizeservice.SizeService,
            _agegroupservice.AgeGroupService
        ]
    })
], CategoriesModule);

//# sourceMappingURL=categories.module.js.map