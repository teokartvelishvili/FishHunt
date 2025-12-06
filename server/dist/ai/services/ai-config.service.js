"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiConfigService", {
    enumerable: true,
    get: function() {
        return AiConfigService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _replicate = /*#__PURE__*/ _interop_require_default(require("replicate"));
const _ai = require("ai");
const _openai = require("@ai-sdk/openai");
const _custommiddleware = require("../custom-middleware");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
let AiConfigService = class AiConfigService {
    getReplicate() {
        return this.replicate;
    }
    getModel() {
        return this.openAIModel;
    }
    constructor(configService){
        this.configService = configService;
        this.replicate = new _replicate.default({
            auth: this.configService.get('REPLICATE_API_TOKEN')
        });
        this.openAIModel = (0, _ai.experimental_wrapLanguageModel)({
            model: (0, _openai.openai)('gpt-3.5-turbo'),
            middleware: _custommiddleware.customMiddleware
        });
    }
};
AiConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AiConfigService);

//# sourceMappingURL=ai-config.service.js.map