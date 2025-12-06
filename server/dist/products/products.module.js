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
    get IndexCleanupService () {
        return IndexCleanupService;
    },
    get ProductsModule () {
        return ProductsModule;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("./services/products.service");
const _productscontroller = require("./controller/products.controller");
const _mongoose = require("@nestjs/mongoose");
const _productschema = require("./schemas/product.schema");
const _appservice = require("../app/services/app.service");
const _cloudinarymodule = require("../cloudinary/cloudinary.module");
const _orderschema = require("../orders/schemas/order.schema");
const _mongoose1 = require("mongoose");
const _productexpertagent = require("../ai/agents/product-expert.agent");
const _aimodule = require("../ai/ai.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let IndexCleanupService = class IndexCleanupService {
    async onModuleInit() {
        try {
            this.logger.log('Checking for and removing problematic indexes...');
            const collection = this.productModel.collection;
            const indexInfo = await collection.indexInformation();
            // Log found indexes
            this.logger.log(`Found indexes: ${JSON.stringify(Object.keys(indexInfo))}`);
            // Look for any index on both sizes and ageGroups
            for (const indexName of Object.keys(indexInfo)){
                if (indexName !== '_id_') {
                    // Skip the default _id index
                    const indexKeys = indexInfo[indexName];
                    const indexFields = indexKeys.map((pair)=>pair[0]);
                    this.logger.log(`Index ${indexName} has fields: ${indexFields.join(', ')}`);
                    // If this index contains both sizes and ageGroups, drop it
                    if (indexFields.includes('ageGroups') && indexFields.includes('sizes') || indexFields.includes('ageGroups') && indexFields.includes('colors') || indexFields.includes('sizes') && indexFields.includes('colors')) {
                        this.logger.warn(`Dropping problematic parallel array index: ${indexName}`);
                        await collection.dropIndex(indexName);
                        this.logger.log(`Successfully dropped index: ${indexName}`);
                    }
                }
            }
            this.logger.log('Index cleanup completed');
        } catch (error) {
            this.logger.error('Error during index cleanup:', error);
        }
    }
    constructor(productModel){
        this.productModel = productModel;
        this.logger = new _common.Logger('IndexCleanupService');
    }
};
IndexCleanupService = _ts_decorate([
    _ts_param(0, (0, _mongoose.InjectModel)(_productschema.Product.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], IndexCleanupService);
let ProductsModule = class ProductsModule {
};
ProductsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeatureAsync([
                {
                    name: _productschema.Product.name,
                    useFactory: ()=>{
                        const schema = _productschema.ProductSchema;
                        // Remove any compound indexes on array fields
                        schema.index({
                            mainCategory: 1
                        });
                        schema.index({
                            subCategory: 1
                        });
                        schema.index({
                            createdAt: -1
                        });
                        // Make sure we don't have any compound indexes on multiple array fields
                        // By explicitly removing them - this will ensure they don't get recreated
                        return schema;
                    }
                },
                {
                    name: _orderschema.Order.name,
                    useFactory: ()=>_orderschema.OrderSchema
                }
            ]),
            _cloudinarymodule.CloudinaryModule,
            _aimodule.AiModule
        ],
        providers: [
            _productsservice.ProductsService,
            _appservice.AppService,
            IndexCleanupService,
            _productexpertagent.ProductExpertAgent
        ],
        controllers: [
            _productscontroller.ProductsController
        ],
        exports: [
            _productsservice.ProductsService,
            _mongoose.MongooseModule.forFeature([
                {
                    name: _productschema.Product.name,
                    schema: _productschema.ProductSchema
                }
            ])
        ]
    })
], ProductsModule);

//# sourceMappingURL=products.module.js.map