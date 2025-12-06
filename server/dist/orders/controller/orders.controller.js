"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrdersController", {
    enumerable: true,
    get: function() {
        return OrdersController;
    }
});
const _common = require("@nestjs/common");
const _rolesguard = require("../../guards/roles.guard");
const _ordersservice = require("../services/orders.service");
const _stockreservationservice = require("../services/stock-reservation.service");
const _userschema = require("../../users/schemas/user.schema");
const _currentuserdecorator = require("../../decorators/current-user.decorator");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
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
let OrdersController = class OrdersController {
    async createOrder(body, user) {
        return this.ordersService.create(body, user._id.toString());
    }
    async getOrders() {
        return this.ordersService.findAll();
    }
    async getUserOrders(user, status) {
        if (status) {
            return this.ordersService.findUserOrdersByStatus(user._id.toString(), status);
        }
        return this.ordersService.findUserOrders(user._id.toString());
    }
    async getOrder(id) {
        return this.ordersService.findById(id);
    }
    async updateOrderPayment(id, paymentResult) {
        return this.ordersService.updatePaid(id, paymentResult);
    }
    async updateOrderDelivery(id) {
        return this.ordersService.updateDelivered(id);
    }
    async cancelOrder(id, user, body) {
        return this.ordersService.cancelOrder(id, body.reason);
    }
    async releaseExpiredStock() {
        await this.stockReservationService.releaseExpiredStockReservations();
        return {
            message: 'Expired stock reservations released'
        };
    }
    async notifyOrderSuccess(id) {
        return this.ordersService.sendSuccessNotification(id);
    }
    async notifyOrderFailure(id) {
        return this.ordersService.sendFailureNotification(id);
    }
    constructor(ordersService, stockReservationService){
        this.ordersService = ordersService;
        this.stockReservationService = stockReservationService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
_ts_decorate([
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('myorders'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "getUserOrders", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Put)(':id/pay'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderPayment", null);
_ts_decorate([
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _common.Put)(':id/deliver'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderDelivery", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(':id/cancel'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
_ts_decorate([
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _common.Post)('release-expired-stock'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "releaseExpiredStock", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(':id/notify-success'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "notifyOrderSuccess", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(':id/notify-failure'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OrdersController.prototype, "notifyOrderFailure", null);
OrdersController = _ts_decorate([
    (0, _common.Controller)('orders'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ordersservice.OrdersService === "undefined" ? Object : _ordersservice.OrdersService,
        typeof _stockreservationservice.StockReservationService === "undefined" ? Object : _stockreservationservice.StockReservationService
    ])
], OrdersController);

//# sourceMappingURL=orders.controller.js.map