"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentsController", {
    enumerable: true,
    get: function() {
        return PaymentsController;
    }
});
const _common = require("@nestjs/common");
const _paymentsservice = require("./payments.service");
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
let PaymentsController = class PaymentsController {
    async createBogPayment(data) {
        try {
            const result = await this.paymentsService.createPayment(data);
            // Update order with external_order_id for callback processing
            if (result.uniqueId && data.product?.productId) {
                try {
                    await this.paymentsService.updateOrderWithExternalId(data.product.productId, result.uniqueId);
                } catch (error) {
                    console.error('Failed to update order with external ID:', error);
                // Continue with payment creation even if this fails
                }
            }
            return result;
        } catch (error) {
            console.error('BOG Payment Error:', error);
            throw error;
        }
    }
    async getBogPaymentStatus(orderId) {
        return this.paymentsService.getPaymentStatus(orderId);
    }
    async handleBogCallback(data) {
        console.log('BOG Payment Callback endpoint hit');
        console.log('Callback data received:', JSON.stringify(data, null, 2));
        const result = await this.paymentsService.handlePaymentCallback(data);
        console.log('Callback processing result:', JSON.stringify(result, null, 2));
        return {
            status: result.success ? 'success' : 'failed',
            message: result.message
        };
    }
    constructor(paymentsService){
        this.paymentsService = paymentsService;
    }
};
_ts_decorate([
    (0, _common.Post)('bog/create'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "createBogPayment", null);
_ts_decorate([
    (0, _common.Get)('bog/status/:orderId'),
    _ts_param(0, (0, _common.Param)('orderId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getBogPaymentStatus", null);
_ts_decorate([
    (0, _common.Post)('bog/callback'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleBogCallback", null);
PaymentsController = _ts_decorate([
    (0, _common.Controller)('payments'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentsservice.PaymentsService === "undefined" ? Object : _paymentsservice.PaymentsService
    ])
], PaymentsController);

//# sourceMappingURL=payments.controller.js.map