"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentsService", {
    enumerable: true,
    get: function() {
        return PaymentsService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _uuid = require("uuid");
const _ordersservice = require("../orders/services/orders.service");
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
let PaymentsService = class PaymentsService {
    async getToken() {
        try {
            const clientId = this.configService.get('BOG_CLIENT_ID');
            const clientSecret = this.configService.get('BOG_CLIENT_SECRET');
            if (!clientId || !clientSecret) {
                throw new Error('BOG credentials are not configured');
            }
            const response = await _axios.default.post('https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token', new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('BOG Token Error:', error.message);
            throw error;
        }
    }
    async createPayment(data) {
        try {
            const token = await this.getToken();
            const externalOrderId = (0, _uuid.v4)();
            const basket = [
                {
                    quantity: data.product.quantity,
                    unit_price: data.product.unitPrice,
                    product_id: data.product.productId,
                    description: data.product.productName
                }
            ];
            const callbackUrl = this.configService.get('BOG_CALLBACK_URL') || 'https://fishhunt-f587.onrender.com/v1/payments/bog/callback';
            console.log('BOG Callback URL:', callbackUrl);
            const payload = {
                callback_url: callbackUrl,
                capture: 'automatic',
                external_order_id: externalOrderId,
                purchase_units: {
                    currency: 'GEL',
                    total_amount: data.product.totalPrice,
                    basket
                },
                payment_method: [
                    'card'
                ],
                ttl: 10,
                redirect_urls: {
                    success: data.successUrl || 'https://fishhunt.vercel.app/checkout/success',
                    fail: data.failUrl || 'https://fishhunt.vercel.app/checkout/fail'
                }
            };
            const response = await _axios.default.post('https://api.bog.ge/payments/v1/ecommerce/orders', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Accept-Language': 'ka',
                    'Idempotency-Key': (0, _uuid.v4)()
                }
            });
            return {
                order_id: response.data.id,
                redirect_url: response.data._links.redirect.href,
                token,
                uniqueId: externalOrderId
            };
        } catch (error) {
            console.error('BOG Service Error:', error.message);
            throw error;
        }
    }
    async getPaymentStatus(orderId) {
        const token = await this.getToken();
        const response = await _axios.default.get(`https://api.bog.ge/payments/v1/receipt/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    async handlePaymentCallback(callbackData) {
        try {
            console.log('BOG Payment Callback received:', JSON.stringify(callbackData, null, 2));
            const { external_order_id, order_status: { key: status }, order_id } = callbackData.body;
            if (!external_order_id && !order_id) {
                console.log('No order identifier found in callback data');
                return {
                    success: false,
                    message: 'No order identifier found'
                };
            }
            console.log(`Processing payment for external_order_id: ${external_order_id}, order_id: ${order_id}, status: ${status}`);
            let paymentStatus;
            try {
                if (order_id) {
                    console.log(`Fetching payment status for order_id: ${order_id}`);
                    paymentStatus = await this.getPaymentStatus(order_id);
                    console.log('Payment status from BOG API:', JSON.stringify(paymentStatus, null, 2));
                }
            } catch (error) {
                console.log('Error fetching payment status from BOG API:', error.message);
                paymentStatus = {
                    status
                };
            }
            const isPaymentSuccessful = paymentStatus?.status === 'completed' || status === 'completed';
            console.log(`Payment successful: ${isPaymentSuccessful}, external_order_id: ${external_order_id}`);
            if (isPaymentSuccessful && external_order_id) {
                try {
                    const paymentResult = {
                        id: order_id || external_order_id,
                        status: paymentStatus?.status || status,
                        update_time: new Date().toISOString(),
                        email_address: paymentStatus?.email || 'unknown@unknown.com'
                    };
                    console.log('Updating order with payment result:', JSON.stringify(paymentResult, null, 2));
                    await this.ordersService.updateOrderByExternalId(external_order_id, paymentResult);
                    console.log(`Order ${external_order_id} successfully updated with payment status`);
                    return {
                        success: true,
                        message: 'Payment processed successfully and order updated'
                    };
                } catch (error) {
                    console.error('Error updating order with payment result:', error.message);
                    return {
                        success: false,
                        message: 'Payment successful but failed to update order: ' + error.message
                    };
                }
            } else {
                console.log('Payment was not successful or external_order_id is missing');
                return {
                    success: false,
                    message: 'Payment was not successful'
                };
            }
        } catch (error) {
            console.error('Error processing payment callback:', error.message);
            return {
                success: false,
                message: 'Error processing payment callback: ' + error.message
            };
        }
    }
    async updateOrderWithExternalId(orderId, externalOrderId) {
        try {
            const order = await this.ordersService.findById(orderId);
            if (order) {
                order.externalOrderId = externalOrderId;
                await order.save();
            }
        } catch (error) {
            console.error('Error updating order with external ID:', error);
            throw error;
        }
    }
    async getOrderByExternalId(externalOrderId) {
        return this.ordersService.findByExternalOrderId(externalOrderId);
    }
    constructor(configService, ordersService){
        this.configService = configService;
        this.ordersService = ordersService;
    }
};
PaymentsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _ordersservice.OrdersService === "undefined" ? Object : _ordersservice.OrdersService
    ])
], PaymentsService);

//# sourceMappingURL=payments.service.js.map