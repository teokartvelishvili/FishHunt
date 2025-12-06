"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductExpertAgent", {
    enumerable: true,
    get: function() {
        return ProductExpertAgent;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _zod = require("zod");
const _aiconfigservice = require("../services/ai-config.service");
const _productgenerationtool = require("../tools/product-generation.tool");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ProductExpertAgent = class ProductExpertAgent {
    async chat(messages) {
        const coreMessages = (0, _ai.convertToCoreMessages)(messages).filter((message)=>message.content.length > 0);
        const systemPrompt = `
      You are a product development expert who helps users create and refine product ideas.

      Follow this interactive process:
      1. When generating basic product info:
        - Ask user for initial product idea
        - Generate draft product details
        - Ask for approval and modifications
        - Get specific inventory count from user
        - Only proceed when user approves

      2. When generating product images:
        - Show image generation prompts
        - Ask for approval before generating
        - Allow user to modify style/angles

      3. When generating brand assets:
        - Propose brand identity elements
        - Get user feedback on style
        - Allow iterations on design

      4. When validating final product:
        - Show complete product summary
        - Get final user approval
        - Make suggested improvements

      5. When saving the product:
        - Validate the product data
        - Save the product to the database
        - Provide a link to the saved product 

      Always ask for explicit user confirmation before proceeding to next step.
      Use markdown formatting for all responses.
      `;
        const result = (0, _ai.streamText)({
            model: this.aiConfig.getModel(),
            system: systemPrompt,
            messages: coreMessages,
            tools: {
                generateBasicInfo: (0, _ai.tool)({
                    description: 'Generate initial product concept from user description',
                    parameters: _zod.z.object({
                        userPrompt: _zod.z.string().describe('User product description'),
                        category: _zod.z.string().describe('Product category')
                    }),
                    execute: async ({ userPrompt, category })=>{
                        const result = await this.productTool.generateBasicInfo({
                            userPrompt,
                            category
                        });
                        return {
                            ...result,
                            message: `
                    ### Generated Product Details
                    - **Name:** ${result.name}
                    - **Brand:** ${result.brand}
                    - **Category:** ${result.category}
                    - **Price:** $${result.price}
                    - **Description:**: ${result.description}

                    ${result.description}


                    > Please review these details. Would you like to:
                    1. Approve and specify inventory count
                    2. Modify any details
                    3. Start over with a different concept

                    What would you like to do?`
                        };
                    }
                }),
                handleApproval: (0, _ai.tool)({
                    description: 'Handle user approval for product details',
                    parameters: _zod.z.object({
                        productInfo: _zod.z.any(),
                        userFeedback: _zod.z.string(),
                        step: _zod.z.string()
                    }),
                    execute: async ({ productInfo, userFeedback, step })=>{
                        // First handle the approval/feedback
                        const approvalResult = await this.productTool.handleUserApproval({
                            productInfo,
                            userFeedback,
                            step: step
                        });
                        // If basic info step was approved, validate the product
                        if (step === 'basic-info' && approvalResult.approved) {
                            const validationResult = await this.productTool.validateProduct(productInfo);
                            if (!validationResult.isValid) {
                                return {
                                    approved: false,
                                    nextAction: 'revise',
                                    message: `Before proceeding, please address these issues:\n${validationResult.missingFields.join('\n')}`,
                                    validationErrors: validationResult.missingFields
                                };
                            }
                        }
                        return approvalResult;
                    }
                }),
                generateProductImages: (0, _ai.tool)({
                    description: 'Generate product images',
                    parameters: _zod.z.object({
                        productInfo: _zod.z.any().describe('Product information')
                    }),
                    execute: async ({ productInfo })=>{
                        const result = await this.productTool.generateProductImages({
                            productInfo
                        });
                        return {
                            ...result,
                            productInfo: {
                                ...productInfo,
                                images: result.images.map((img)=>img.url)
                            }
                        };
                    }
                }),
                generateBrandAssets: (0, _ai.tool)({
                    description: 'Generate brand logo and assets',
                    parameters: _zod.z.object({
                        brand: _zod.z.string(),
                        productInfo: _zod.z.any()
                    }),
                    execute: async ({ brand, productInfo })=>{
                        const result = await this.productTool.generateBrandAssets({
                            brand,
                            productInfo
                        });
                        return {
                            ...result,
                            productInfo: {
                                ...productInfo,
                                brandLogo: result.brandLogo.url
                            }
                        };
                    }
                }),
                validateProduct: (0, _ai.tool)({
                    description: 'Validate product details and completeness',
                    parameters: _zod.z.object({
                        product: _zod.z.any()
                    }),
                    execute: async ({ product })=>{
                        const result = await this.productTool.validateProduct(product);
                        return result;
                    }
                }),
                saveProduct: (0, _ai.tool)({
                    description: 'Save the finalized product to the database',
                    parameters: _zod.z.object({
                        product: _zod.z.any().describe('Complete product information')
                    }),
                    execute: async ({ product })=>{
                        const result = await this.productTool.validateProduct(product);
                        if (!result.isValid) {
                            return {
                                success: false,
                                message: 'Product validation failed. Please fix the following issues:',
                                errors: result.missingFields,
                                canProgress: false
                            };
                        }
                        const saveResult = await this.productTool.saveProduct(product);
                        if (!saveResult.success) {
                            return {
                                success: false,
                                message: `Unable to save product: ${saveResult.message}`,
                                errors: saveResult.errors,
                                canProgress: false
                            };
                        }
                        return {
                            success: true,
                            message: `Perfect! I've saved the product to the database. You can view it at /products/${saveResult.productId}`,
                            canProgress: true,
                            productId: saveResult.productId
                        };
                    }
                })
            },
            onStepFinish ({ text, toolCalls, toolResults, finishReason }) {
                console.log('Step:', text);
                console.log('Tool Calls:', JSON.stringify(toolCalls, null, 2));
                console.log('Tool Results:', JSON.stringify(toolResults, null, 2));
                console.log('Finish Reason:', finishReason);
            },
            maxSteps: 20,
            experimental_telemetry: {
                isEnabled: true,
                functionId: 'stream-text'
            }
        });
        return result;
    }
    constructor(aiConfig, productTool){
        this.aiConfig = aiConfig;
        this.productTool = productTool;
    }
};
ProductExpertAgent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiconfigservice.AiConfigService === "undefined" ? Object : _aiconfigservice.AiConfigService,
        typeof _productgenerationtool.ProductGenerationTool === "undefined" ? Object : _productgenerationtool.ProductGenerationTool
    ])
], ProductExpertAgent);

//# sourceMappingURL=product-expert.agent.js.map