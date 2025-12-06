"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageGenerationService", {
    enumerable: true,
    get: function() {
        return ImageGenerationService;
    }
});
const _common = require("@nestjs/common");
const _aiconfigservice = require("./ai-config.service");
const _cloudinaryservice = require("../../cloudinary/services/cloudinary.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImageGenerationService = class ImageGenerationService {
    async generateProductImage(options) {
        try {
            const replicate = this.aiConfig.getReplicate();
            const output = await replicate.run(options.model || this.defaultModel, {
                input: {
                    prompt: options.prompt,
                    negative_prompt: options.negativePrompt,
                    width: options.width || 1024,
                    height: options.height || 1024,
                    num_inference_steps: options.steps || 4,
                    num_outputs: options.numOutputs || 1,
                    seed: options.seed || Math.floor(Math.random() * 1000000),
                    ...options.sourceImage && {
                        image: options.sourceImage,
                        image_strength: options.imageStrength || 0.7
                    }
                }
            });
            const urls = await Promise.all(// @ts-ignore
            output.map(async (item, index)=>{
                return this.cloudinary.uploadBuffer(item);
            }));
            return {
                urls,
                metadata: {
                    model: options.model || this.defaultModel,
                    prompt: options.prompt,
                    generationTime: Date.now()
                }
            };
        } catch (error) {
            console.error('Error generating product image', error);
            throw error;
        }
    }
    constructor(aiConfig, cloudinary){
        this.aiConfig = aiConfig;
        this.cloudinary = cloudinary;
        this.defaultModel = 'black-forest-labs/flux-schnell';
    }
};
ImageGenerationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiconfigservice.AiConfigService === "undefined" ? Object : _aiconfigservice.AiConfigService,
        typeof _cloudinaryservice.CloudinaryService === "undefined" ? Object : _cloudinaryservice.CloudinaryService
    ])
], ImageGenerationService);

//# sourceMappingURL=image-generation.service.js.map