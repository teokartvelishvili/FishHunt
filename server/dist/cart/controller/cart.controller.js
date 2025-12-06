"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartController", {
    enumerable: true,
    get: function() {
        return CartController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../guards/jwt-auth.guard");
const _currentuserdecorator = require("../../decorators/current-user.decorator");
const _cartservice = require("../services/cart.service");
const _addtocartdto = require("../dtos/add-to-cart.dto");
const _saveshippingdetailsdto = require("../dtos/save-shipping-details.dto");
const _savepaymentmethoddto = require("../dtos/save-payment-method.dto");
const _userschema = require("../../users/schemas/user.schema");
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
let CartController = class CartController {
    getCart(user) {
        return this.cartService.getCart(user);
    }
    addToCart({ productId, qty, size, color, ageGroup, price }, user) {
        if (!productId) {
            throw new _common.BadRequestException('Product ID is required');
        }
        return this.cartService.addCartItem(productId, qty, user, size, color, ageGroup, price);
    }
    updateCartItem(productId, { qty, size, color }, user) {
        return this.cartService.updateCartItemQty(productId, qty, user, size, color);
    }
    removeFromCart(productId, { size, color, ageGroup }, user) {
        return this.cartService.removeCartItem(productId, user, size, color, ageGroup);
    }
    saveShipping(shippingDetails, user) {
        return this.cartService.validateShippingDetails(shippingDetails);
    }
    savePaymentMethod({ paymentMethod }, user) {
        console.log('Cart controller received payment method:', paymentMethod);
        console.log('Full request body:', {
            paymentMethod
        });
        return this.cartService.validatePaymentMethod(paymentMethod);
    }
    clearCart(user) {
        return this.cartService.clearCart(user);
    }
    constructor(cartService){
        this.cartService = cartService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
_ts_decorate([
    (0, _common.Post)('items'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _addtocartdto.AddToCartDto === "undefined" ? Object : _addtocartdto.AddToCartDto,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
_ts_decorate([
    (0, _common.Put)('items/:productId'),
    _ts_param(0, (0, _common.Param)('productId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "updateCartItem", null);
_ts_decorate([
    (0, _common.Delete)('items/:productId'),
    _ts_param(0, (0, _common.Param)('productId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "removeFromCart", null);
_ts_decorate([
    (0, _common.Post)('shipping'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _saveshippingdetailsdto.SaveShippingDetailsDto === "undefined" ? Object : _saveshippingdetailsdto.SaveShippingDetailsDto,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "saveShipping", null);
_ts_decorate([
    (0, _common.Post)('payment'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _savepaymentmethoddto.SavePaymentMethodDto === "undefined" ? Object : _savepaymentmethoddto.SavePaymentMethodDto,
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "savePaymentMethod", null);
_ts_decorate([
    (0, _common.Delete)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userschema.UserDocument === "undefined" ? Object : _userschema.UserDocument
    ]),
    _ts_metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
CartController = _ts_decorate([
    (0, _common.Controller)('cart'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cartservice.CartService === "undefined" ? Object : _cartservice.CartService
    ])
], CartController);

//# sourceMappingURL=cart.controller.js.map