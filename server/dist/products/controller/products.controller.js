"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsController", {
    enumerable: true,
    get: function() {
        return ProductsController;
    }
});
const _common = require("@nestjs/common");
const _rolesguard = require("../../guards/roles.guard");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _productdto = require("../dtos/product.dto");
const _reviewdto = require("../dtos/review.dto");
const _productsservice = require("../services/products.service");
const _userschema = require("../../users/schemas/user.schema");
const _currentuserdecorator = require("../../decorators/current-user.decorator");
const _platformexpress = require("@nestjs/platform-express");
const _appservice = require("../../app/services/app.service");
const _productexpertagent = require("../../ai/agents/product-expert.agent");
const _express = require("express");
const _agents = require("../../types/agents");
const _rolesdecorator = require("../../decorators/roles.decorator");
const _roleenum = require("../../types/role.enum");
const _productschema = require("../schemas/product.schema");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ProductsController = class ProductsController {
    getProducts(keyword, page, limit, brand, mainCategory, subCategory, sortBy, sortDirection, ageGroup, size, color, discounted, includeVariants) {
        console.log('Getting products with filters:', {
            mainCategory,
            subCategory,
            ageGroup,
            size,
            color,
            discounted
        });
        return this.productsService.findMany({
            keyword,
            page,
            limit,
            status: _productschema.ProductStatus.APPROVED,
            brand,
            mainCategory,
            subCategory,
            sortBy,
            sortDirection,
            ageGroup,
            size,
            color,
            discounted: discounted === 'true',
            includeVariants: includeVariants === 'true'
        });
    }
    getUserProducts(user, keyword, page, limit) {
        return this.productsService.findMany({
            keyword,
            page,
            limit,
            user: user.role === _roleenum.Role.Admin ? undefined : user,
            // Add this to ensure we get populated category data
            includeVariants: true
        });
    }
    async getPendingProducts() {
        console.log('Getting pending products');
        return this.productsService.findByStatus(_productschema.ProductStatus.PENDING);
    }
    async getBrands() {
        return this.productsService.findAllBrands();
    }
    async getTopRatedProducts() {
        const products = await this.productsService.findTopRated();
        // Return in a consistent format for the frontend
        return {
            items: products,
            total: products.length,
            page: 1,
            pages: 1
        };
    }
    getProduct(id) {
        return this.productsService.findById(id);
    }
    getProductVariants(id) {
        return this.productsService.getProductVariants(id);
    }
    async findAll(query) {
        return this.productsService.findAll(query);
    }
    deleteUser(id) {
        return this.productsService.deleteOne(id);
    }
    async createProduct(user, productData, allFiles) {
        const files = allFiles.images;
        const { brandLogo } = allFiles;
        if (!files || files.length === 0) {
            throw new _common.BadRequestException('At least one image is required');
        }
        try {
            const imageUrls = await Promise.all(files.map((file)=>this.appService.uploadImageToCloudinary(file)));
            let brandLogoUrl = null;
            if (brandLogo && brandLogo.length > 0) {
                brandLogoUrl = await this.appService.uploadImageToCloudinary(brandLogo[0]);
            } else if (productData.brandLogoUrl) {
                brandLogoUrl = productData.brandLogoUrl;
            }
            // Parse JSON arrays for attributes if they're strings
            let ageGroups = productData.ageGroups;
            let sizes = productData.sizes;
            let colors = productData.colors;
            let hashtags = productData.hashtags;
            if (typeof ageGroups === 'string') {
                try {
                    ageGroups = JSON.parse(ageGroups);
                } catch (e) {
                    ageGroups = [];
                }
            }
            if (typeof sizes === 'string') {
                try {
                    sizes = JSON.parse(sizes);
                } catch (e) {
                    sizes = [];
                }
            }
            if (typeof colors === 'string') {
                try {
                    colors = JSON.parse(colors);
                } catch (e) {
                    colors = [];
                }
            }
            if (typeof hashtags === 'string') {
                try {
                    hashtags = JSON.parse(hashtags);
                } catch (e) {
                    hashtags = [];
                }
            }
            console.log('Parsed hashtags:', hashtags);
            console.log('ProductData hashtags:', productData.hashtags);
            // Extract the main category data
            const { mainCategory, subCategory, videoDescription, ...otherProductData } = productData;
            // Create the product with proper category references
            return this.productsService.create({
                ...otherProductData,
                // Keep legacy fields for backward compatibility
                category: otherProductData.category || 'Other',
                // New category system
                mainCategory,
                subCategory,
                ageGroups,
                sizes,
                colors,
                hashtags,
                user,
                images: imageUrls,
                brandLogo: brandLogoUrl,
                videoDescription
            });
        } catch (error) {
            console.error('Error creating product:', error);
            throw new _common.InternalServerErrorException('Failed to process images or create product ', error.message);
        }
    }
    async updateProduct(id, user, productData, files) {
        const product = await this.productsService.findById(id);
        if (user.role !== _roleenum.Role.Admin && product.user.toString() !== user._id.toString()) {
            throw new _common.UnauthorizedException('You can only edit your own products');
        }
        try {
            let imageUrls;
            let brandLogoUrl;
            if (files?.images?.length) {
                imageUrls = await Promise.all(files.images.map((file)=>this.appService.uploadImageToCloudinary(file)));
            }
            if (files?.brandLogo?.length) {
                brandLogoUrl = await this.appService.uploadImageToCloudinary(files.brandLogo[0]);
            } else if (productData.brandLogoUrl) {
                brandLogoUrl = productData.brandLogoUrl;
            }
            // Parse JSON arrays for attributes if they're strings
            let ageGroups = productData.ageGroups;
            let sizes = productData.sizes;
            let colors = productData.colors;
            let hashtags = productData.hashtags;
            if (typeof ageGroups === 'string') {
                try {
                    ageGroups = JSON.parse(ageGroups);
                } catch (e) {
                    ageGroups = [];
                }
            }
            if (typeof sizes === 'string') {
                try {
                    sizes = JSON.parse(sizes);
                } catch (e) {
                    sizes = [];
                }
            }
            if (typeof colors === 'string') {
                try {
                    colors = JSON.parse(colors);
                } catch (e) {
                    colors = [];
                }
            }
            if (typeof hashtags === 'string') {
                try {
                    hashtags = JSON.parse(hashtags);
                } catch (e) {
                    hashtags = [];
                }
            }
            // Handle existing images
            let existingImages = [];
            if (productData.existingImages) {
                try {
                    existingImages = JSON.parse(productData.existingImages);
                } catch (e) {
                    console.error('Error parsing existingImages:', e);
                }
            }
            // Combine existing images with new uploads if any
            const finalImages = imageUrls ? [
                ...existingImages,
                ...imageUrls
            ] : existingImages.length > 0 ? existingImages : product.images; // Keep original images if no new ones provided
            // Remove user property if it exists in productData to avoid schema conflicts
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { user: userFromData, existingImages: _, ...productDataWithoutUser } = productData;
            // Explicitly handle mainCategory and subCategory to ensure they are updated properly
            const mainCategory = productData.mainCategory !== undefined ? productData.mainCategory : product.mainCategory;
            const subCategory = productData.subCategory !== undefined ? productData.subCategory : product.subCategory;
            const parseVariants = typeof productData.variants === 'string' ? JSON.parse(productData.variants) : productData.variants;
            // Create update data object
            const updateData = {
                ...productDataWithoutUser,
                mainCategory,
                subCategory,
                images: finalImages,
                ...brandLogoUrl && {
                    brandLogo: brandLogoUrl
                },
                ...user.role === _roleenum.Role.Seller && {
                    status: _productschema.ProductStatus.PENDING
                }
            };
            console.log('UPDATING PRODUCT WITH DATA:', updateData);
            const updatedProduct = await this.productsService.update(id, updateData);
            console.log('Updated product:', updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error('Update error:', error);
            throw new _common.InternalServerErrorException('Failed to update product', error.message);
        }
    }
    async createReview(id, { rating, comment }, user) {
        try {
            return await this.productsService.createReview(id, user, rating, comment);
        } catch (error) {
            console.log('Review error:', error);
            // Re-throw the error to maintain the same behavior for the client
            throw error;
        }
    }
    async chat(body, res) {
        const { messages } = body;
        const result = await this.productExpertAgent.chat(messages);
        return result.pipeDataStreamToResponse(res);
    }
    async updateProductStatus(id, { status, rejectionReason }) {
        return this.productsService.updateStatus(id, status, rejectionReason);
    }
    getAllColors() {
        return this.productsService.getAllColors();
    }
    getAllSizes() {
        return this.productsService.getAllSizes();
    }
    getAllAgeGroups() {
        return this.productsService.getAllAgeGroups();
    }
    constructor(productsService, appService, productExpertAgent){
        this.productsService = productsService;
        this.appService = appService;
        this.productExpertAgent = productExpertAgent;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get products with filters'
    }),
    _ts_param(0, (0, _common.Query)('keyword')),
    _ts_param(1, (0, _common.Query)('page')),
    _ts_param(2, (0, _common.Query)('limit')),
    _ts_param(3, (0, _common.Query)('brand')),
    _ts_param(4, (0, _common.Query)('mainCategory')),
    _ts_param(5, (0, _common.Query)('subCategory')),
    _ts_param(6, (0, _common.Query)('sortBy')),
    _ts_param(7, (0, _common.Query)('sortDirection')),
    _ts_param(8, (0, _common.Query)('ageGroup')),
    _ts_param(9, (0, _common.Query)('size')),
    _ts_param(10, (0, _common.Query)('color')),
    _ts_param(11, (0, _common.Query)('discounted')),
    _ts_param(12, (0, _common.Query)('includeVariants')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getProducts", null);
_ts_decorate([
    (0, _common.Get)('user'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin, _roleenum.Role.Seller),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('keyword')),
    _ts_param(2, (0, _common.Query)('page')),
    _ts_param(3, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getUserProducts", null);
_ts_decorate([
    (0, _common.Get)('pending'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "getPendingProducts", null);
_ts_decorate([
    (0, _common.Get)('brands'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all available brands'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "getBrands", null);
_ts_decorate([
    (0, _common.Get)('topRated'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "getTopRatedProducts", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get product by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Product ID'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getProduct", null);
_ts_decorate([
    (0, _common.Get)(':id/variants'),
    (0, _swagger.ApiOperation)({
        summary: 'Get available sizes and colors for a product'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        description: 'Product ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns available sizes, colors and variants',
        schema: {
            properties: {
                sizes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                colors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                variants: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            size: {
                                type: 'string'
                            },
                            color: {
                                type: 'string'
                            },
                            stock: {
                                type: 'number'
                            },
                            sku: {
                                type: 'string'
                            }
                        }
                    }
                },
                hasVariants: {
                    type: 'boolean'
                },
                countInStock: {
                    type: 'number'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Product not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductVariants", null);
_ts_decorate([
    (0, _common.Get)('find-all'),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productdto.FindAllProductsDto === "undefined" ? Object : _productdto.FindAllProductsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteUser", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin, _roleenum.Role.Seller),
    (0, _common.Post)(),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10
        },
        {
            name: 'brandLogo',
            maxCount: 1
        }
    ], {
        fileFilter: (req, file, cb)=>{
            const allowedMimeTypes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif'
            ];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    })),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        typeof Omit === "undefined" ? Object : Omit,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin, _roleenum.Role.Seller),
    (0, _common.Put)(':id'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileFieldsInterceptor)([
        {
            name: 'images',
            maxCount: 10
        },
        {
            name: 'brandLogo',
            maxCount: 1
        }
    ])),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.UploadedFiles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Put)(':id/review'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _reviewdto.ReviewDto === "undefined" ? Object : _reviewdto.ReviewDto,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "createReview", null);
_ts_decorate([
    (0, _common.Post)('agent/chat'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agents.ChatRequest === "undefined" ? Object : _agents.ChatRequest,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "chat", null);
_ts_decorate([
    (0, _common.Put)(':id/status'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_roleenum.Role.Admin),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductStatus", null);
_ts_decorate([
    (0, _common.Get)('colors'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all unique colors used in products'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all unique colors',
        schema: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getAllColors", null);
_ts_decorate([
    (0, _common.Get)('sizes'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all unique sizes used in products'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all unique sizes',
        schema: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getAllSizes", null);
_ts_decorate([
    (0, _common.Get)('age-groups'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all unique age groups used in products'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all unique age groups',
        schema: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "getAllAgeGroups", null);
ProductsController = _ts_decorate([
    (0, _swagger.ApiTags)('products'),
    (0, _common.Controller)('products'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _appservice.AppService === "undefined" ? Object : _appservice.AppService,
        typeof _productexpertagent.ProductExpertAgent === "undefined" ? Object : _productexpertagent.ProductExpertAgent
    ])
], ProductsController);

//# sourceMappingURL=products.controller.js.map