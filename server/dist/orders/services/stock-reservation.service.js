"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StockReservationService", {
    enumerable: true,
    get: function() {
        return StockReservationService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _schedule = require("@nestjs/schedule");
const _orderschema = require("../schemas/order.schema");
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
let StockReservationService = class StockReservationService {
    /**
   * Runs every 10 minutes to check for expired stock reservations
   * Automatically releases expired stock reservations and marks orders as cancelled
   */ async releaseExpiredStockReservations() {
        const now = new Date();
        // Find unpaid orders with expired stock reservations that haven't been processed yet
        const expiredOrders = await this.orderModel.find({
            isPaid: false,
            stockReservationExpires: {
                $lte: now
            },
            status: {
                $in: [
                    'pending',
                    'processing'
                ]
            }
        });
        if (expiredOrders.length === 0) {
            return;
        }
        this.logger.log(`Processing ${expiredOrders.length} expired stock reservations`);
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async ()=>{
                for (const order of expiredOrders){
                    try {
                        // Double-check order hasn't been paid or cancelled in the meantime
                        const freshOrder = await this.orderModel.findById(order._id).session(session);
                        if (!freshOrder || freshOrder.isPaid || freshOrder.status === 'cancelled') {
                            this.logger.log(`Skipping order ${order._id} - already processed or paid`);
                            continue;
                        }
                        await this.refundStockForOrder(freshOrder, session);
                        // Mark order as cancelled instead of deleting it
                        freshOrder.set('status', 'cancelled');
                        freshOrder.set('statusReason', 'Stock reservation expired after 30 minutes');
                        freshOrder.set('cancelledAt', new Date());
                        await freshOrder.save({
                            session
                        });
                        this.logger.log(`Released stock and cancelled expired order: ${order._id}`);
                    } catch (error) {
                        this.logger.error(`Error releasing stock for order ${order._id}:`, error);
                    }
                }
            });
        } finally{
            await session.endSession();
        }
        this.logger.log(`Released stock for ${expiredOrders.length} expired orders`);
    }
    /**
   * Refund stock for a specific order - with safety checks
   */ async refundStockForOrder(order, session) {
        // Ensure order is in a state where stock refund is appropriate
        if (order.isPaid || order.status === 'cancelled') {
            this.logger.warn(`Attempted to refund stock for order ${order._id} but it's already paid or cancelled`);
            return;
        }
        for (const item of order.orderItems){
            const product = await this.productModel.findById(item.productId).session(session);
            if (!product) {
                this.logger.warn(`Product with ID ${item.productId} not found during stock refund for order ${order._id}`);
                continue;
            }
            // Refund stock
            if (product.variants && product.variants.length > 0 && (item.size || item.color || item.ageGroup)) {
                const variantIndex = product.variants.findIndex((v)=>v.size === item.size && v.color === item.color && v.ageGroup === item.ageGroup);
                if (variantIndex >= 0) {
                    product.variants[variantIndex].stock += item.qty;
                } else {
                    product.variants.push({
                        size: item.size,
                        color: item.color,
                        ageGroup: item.ageGroup,
                        stock: item.qty
                    });
                }
                product.countInStock += item.qty;
            } else {
                product.variants.push({
                    size: item.size,
                    color: item.color,
                    ageGroup: item.ageGroup,
                    stock: item.qty
                });
                product.countInStock += item.qty;
            }
            await product.save({
                session
            });
        }
    }
    /**
   * Manually release stock for a specific order (can be called from API)
   */ async releaseStockForOrder(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }
        if (order.isPaid) {
            throw new Error(`Cannot release stock for paid order ${orderId}`);
        }
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async ()=>{
                await this.refundStockForOrder(order, session);
                // Mark order as cancelled
                order.set('status', 'cancelled');
                order.set('statusReason', 'Manually cancelled');
                await order.save({
                    session
                });
            });
            this.logger.log(`Manually released stock for order: ${orderId}`);
        } finally{
            await session.endSession();
        }
    }
    constructor(orderModel, productModel, connection){
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.connection = connection;
        this.logger = new _common.Logger(StockReservationService.name);
    }
};
_ts_decorate([
    (0, _schedule.Cron)('0 */1 * * * *'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], StockReservationService.prototype, "releaseExpiredStockReservations", null);
StockReservationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_orderschema.Order.name)),
    _ts_param(1, (0, _mongoose.InjectModel)(_productschema.Product.name)),
    _ts_param(2, (0, _mongoose.InjectConnection)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Connection === "undefined" ? Object : _mongoose1.Connection
    ])
], StockReservationService);

//# sourceMappingURL=stock-reservation.service.js.map