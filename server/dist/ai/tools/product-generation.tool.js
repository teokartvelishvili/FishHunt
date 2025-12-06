"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductGenerationTool", {
    enumerable: true,
    get: function() {
        return ProductGenerationTool;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _zod = require("zod");
const _aiconfigservice = require("../services/ai-config.service");
const _imagegenerationservice = require("../services/image-generation.service");
const _productsservice = require("../../products/services/products.service");
const _productschema = require("../../products/schemas/product.schema");
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
let ProductGenerationTool = class ProductGenerationTool {
    async generateBasicInfo({ userPrompt, category }) {
        try {
            const { object } = await (0, _ai.generateObject)({
                model: this.aiConfig.getModel(),
                prompt: `Generate initial product concept based on: ${userPrompt}. Category: ${category}`,
                schema: _zod.z.object({
                    name: _zod.z.string().describe('Product name'),
                    description: _zod.z.string().describe('Detailed product description'),
                    brand: _zod.z.string().describe('Brand name'),
                    category: _zod.z.string(),
                    price: _zod.z.number().describe('Retail price in USD'),
                    countInStock: _zod.z.number().describe('User-specified inventory count'),
                    userApproved: _zod.z.boolean().default(false),
                    userFeedback: _zod.z.string().optional(),
                    needsUserInput: _zod.z.array(_zod.z.string()).default([
                        'countInStock'
                    ])
                })
            });
            return object;
        } catch (error) {
            console.error('Error generating basic info', error);
            throw error;
        }
    }
    async generateProductImages({ productInfo }) {
        const basePrompt = `Professional product photography of a ${productInfo.brand} ${productInfo.name}, ${productInfo.category},
      premium product visualization, floating in space, light gray background (#F0F0F0),
      soft shadow beneath product, studio lighting, 8k resolution, photorealistic, ultra detailed`;
        const seed = Math.floor(Math.random() * 1000000);
        const angles = [
            {
                name: 'front',
                prompt: `${basePrompt}, straight front view, perfectly centered`
            },
            {
                name: 'side',
                prompt: `${basePrompt}, perfect side profile view, showing product depth`
            },
            {
                name: '45-degree',
                prompt: `${basePrompt}, 45-degree angle view showing front and side`
            },
            {
                name: 'back',
                prompt: `${basePrompt}, straight back view showing ports and connections`
            }
        ];
        const images = await Promise.all(angles.map((angle)=>this.imageService.generateProductImage({
                prompt: angle.prompt,
                negativePrompt: 'text, watermark, low quality, blurry, distorted, hands, people, accessories, busy background, pure white background',
                width: 1024,
                height: 1024,
                seed
            })));
        return {
            images: images.map((image, index)=>({
                    url: image.urls[0]
                }))
        };
    }
    async generateBrandAssets({ brand, productInfo }) {
        try {
            const { object: logoPrompt } = await (0, _ai.generateObject)({
                model: this.aiConfig.getModel(),
                prompt: `Generate a logo prompt for brand: ${brand}, product type: ${productInfo.category}`,
                schema: _zod.z.object({
                    prompt: _zod.z.string().describe('Logo generation prompt'),
                    style: _zod.z.object({
                        colors: _zod.z.array(_zod.z.string()),
                        moodWords: _zod.z.array(_zod.z.string()),
                        composition: _zod.z.string()
                    })
                })
            });
            const brandLogo = await this.imageService.generateProductImage({
                prompt: logoPrompt.prompt
            });
            return {
                brandLogo: {
                    url: brandLogo.urls[0]
                }
            };
        } catch (error) {
            console.error('Error generating brand assets', error);
            throw error;
        }
    }
    async validateProduct(product) {
        const productSchema = _zod.z.object({
            name: _zod.z.string().min(1, 'Product name is required'),
            description: _zod.z.string().min(10, 'Description must be at least 10 characters'),
            brand: _zod.z.string().min(1, 'Brand name is required'),
            category: _zod.z.string().min(1, 'Category is required'),
            price: _zod.z.number().positive('Price must be positive'),
            countInStock: _zod.z.number().min(0, 'Stock cannot be negative'),
            images: _zod.z.array(_zod.z.string().url()).min(1, 'At least one product image is required'),
            brandLogo: _zod.z.string().url('Brand logo URL is required'),
            deliveryType: _zod.z.nativeEnum(_productschema.DeliveryType).optional(),
            minDeliveryDays: _zod.z.number().min(1).optional(),
            maxDeliveryDays: _zod.z.number().min(1).optional()
        });
        const schemaValidation = productSchema.safeParse(product);
        const { object: aiValidation } = await (0, _ai.generateObject)({
            model: this.aiConfig.getModel(),
            prompt: `Validate product details: ${JSON.stringify(product)}`,
            schema: _zod.z.object({
                isValid: _zod.z.boolean(),
                missingFields: _zod.z.array(_zod.z.string()),
                suggestions: _zod.z.array(_zod.z.string()),
                marketFitScore: _zod.z.number().min(0).max(100),
                pricingFeedback: _zod.z.string()
            })
        });
        return {
            isValid: schemaValidation.success && aiValidation.isValid,
            missingFields: [
                ...schemaValidation.success ? [] : Object.keys(schemaValidation.error.formErrors.fieldErrors),
                ...aiValidation.missingFields
            ],
            suggestions: aiValidation.suggestions,
            marketFitScore: aiValidation.marketFitScore,
            pricingFeedback: aiValidation.pricingFeedback
        };
    }
    async handleUserApproval({ productInfo, userFeedback, step }) {
        const { object } = await (0, _ai.generateObject)({
            model: this.aiConfig.getModel(),
            prompt: `Process user feedback: ${userFeedback} for step: ${step}`,
            schema: _zod.z.object({
                approved: _zod.z.boolean(),
                updatedFields: _zod.z.record(_zod.z.any()).optional(),
                nextAction: _zod.z.enum([
                    'proceed',
                    'modify',
                    'restart'
                ]),
                message: _zod.z.string()
            })
        });
        return object;
    }
    async saveProduct(product) {
        console.log('Received product data:', JSON.stringify(product, null, 2));
        const productSchema = _zod.z.object({
            name: _zod.z.string(),
            description: _zod.z.string(),
            brand: _zod.z.string(),
            category: _zod.z.string(),
            price: _zod.z.number().positive(),
            countInStock: _zod.z.number().min(0),
            images: _zod.z.array(_zod.z.string().url()),
            brandLogo: _zod.z.string().url().optional(),
            deliveryType: _zod.z.nativeEnum(_productschema.DeliveryType).optional(),
            minDeliveryDays: _zod.z.number().optional(),
            maxDeliveryDays: _zod.z.number().optional()
        });
        try {
            const transformedData = {
                ...product,
                images: Array.isArray(product.images) ? product.images.map((img)=>typeof img === 'string' ? img : img.url) : [],
                brandLogo: typeof product.brandLogo === 'string' ? product.brandLogo : product.brandLogo?.url,
                deliveryType: product.deliveryType || _productschema.DeliveryType.FishHunt
            };
            console.log('Transforming product data:', transformedData);
            const validatedProduct = productSchema.parse(transformedData);
            const savedProduct = await this.productService.create(validatedProduct);
            return {
                success: true,
                productId: savedProduct._id.toString(),
                message: `Successfully saved ${savedProduct.name} to the database!`
            };
        } catch (error) {
            console.error('Product validation/save error:', error);
            if (error instanceof _zod.z.ZodError) {
                return {
                    success: false,
                    message: 'Invalid product data',
                    errors: error.errors.map((e)=>({
                            field: e.path.join('.'),
                            message: e.message
                        }))
                };
            }
            console.error('Error saving product:', error);
            return {
                success: false,
                message: 'Failed to save product to database',
                error: error.message
            };
        }
    }
    constructor(aiConfig, imageService, productService){
        this.aiConfig = aiConfig;
        this.imageService = imageService;
        this.productService = productService;
    }
};
ProductGenerationTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_productsservice.ProductsService))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiconfigservice.AiConfigService === "undefined" ? Object : _aiconfigservice.AiConfigService,
        typeof _imagegenerationservice.ImageGenerationService === "undefined" ? Object : _imagegenerationservice.ImageGenerationService,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService
    ])
], ProductGenerationTool);

//# sourceMappingURL=product-generation.tool.js.map