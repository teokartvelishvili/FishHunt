"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartService", {
    enumerable: true,
    get: function() {
        return CartService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _cartschema = require("../schemas/cart.schema");
const _productsservice = require("../../products/services/products.service");
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
let CartService = class CartService {
    async getCart(user) {
        let cart = await this.cartModel.findOne({
            userId: user._id
        });
        if (!cart) {
            cart = await this.cartModel.create({
                userId: user._id,
                items: []
            });
        }
        const productIds = cart.items.map((item)=>item.productId);
        const products = await this.productsService.findByIds(productIds);
        cart.items = cart.items.map((item)=>{
            const product = products.find((p)=>p._id.toString() === item.productId.toString());
            if (product) {
                item.qty = Math.min(item.qty, product.countInStock);
                item.countInStock = product.variants.find((v)=>v.size === item.size && v.color === item.color && v.ageGroup === item.ageGroup)?.stock || product.countInStock;
            }
            return item;
        });
        return cart;
    }
    calculatePrices(cart) {
        cart.itemsPrice = cart.items.reduce((acc, item)=>acc + item.price * item.qty, 0);
        cart.taxPrice = Number((0.02 * cart.itemsPrice).toFixed(2));
        cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 0;
        cart.totalPrice = cart.itemsPrice + cart.taxPrice + cart.shippingPrice;
        return cart;
    }
    async addItemToCart(userId, productId, qty) {
        const product = await this.productsService.findById(productId);
        if (!product) throw new _common.NotFoundException('Product not found');
        let cart = await this.cartModel.findOne({
            user: userId
        });
        if (!cart) {
            cart = await this.cartModel.create({
                user: userId,
                items: []
            });
        }
        const existingItem = cart.items.find((item)=>item.productId.toString() === productId);
        if (existingItem) {
            existingItem.qty = qty;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                nameEn: product.nameEn,
                image: product.images[0],
                price: product.price,
                countInStock: product.countInStock,
                qty
            });
        }
        this.calculatePrices(cart);
        return await cart.save();
    }
    async addCartItem(productId, qty, user, size, color, ageGroup, price) {
        const product = await this.productsService.findById(productId);
        if (!product) throw new _common.NotFoundException('Product not found');
        const cart = await this.getCart(user);
        // Check if we have this exact variant in the cart
        const existingItem = cart.items.find((item)=>item.productId.toString() === productId && item.size === size && item.color === color && item.ageGroup === ageGroup);
        console.log('Existing item:', product.variants, size, color, ageGroup);
        if (existingItem) {
            existingItem.qty = qty;
            // Update price if provided (to handle discount changes)
            if (price !== undefined) {
                existingItem.price = price;
            }
        } else {
            const cartItem = {
                productId: product._id.toString(),
                name: product.name,
                nameEn: product.nameEn,
                image: product.images[0],
                price: price ?? product.price,
                countInStock: product.variants?.find((v)=>v.size === size && v.color === color && v.ageGroup === ageGroup)?.stock || product.countInStock,
                qty,
                size,
                color,
                ageGroup
            };
            cart.items.push(cartItem);
        }
        this.calculatePrices(cart);
        return cart.save();
    }
    async removeCartItem(productId, user, size, color, ageGroup) {
        const cart = await this.getCart(user);
        // Filter items to remove the specific variant
        cart.items = cart.items.filter((item)=>!(item.productId.toString() === productId && (!size || item.size === size) && (!color || item.color === color) && (!ageGroup || item.ageGroup === ageGroup)));
        this.calculatePrices(cart);
        return cart.save();
    }
    async updateCartItemQty(productId, qty, user, size, color) {
        const cart = await this.getCart(user);
        const item = cart.items.find((item)=>item.productId.toString() === productId && item.size === size && item.color === color);
        if (!item) throw new _common.NotFoundException('Item not found in cart');
        // For products with variants, we need to check stock differently
        const product = await this.productsService.findById(productId);
        if (!product) throw new _common.NotFoundException('Product not found');
        // Check stock for variant
        if (size && color && product.variants && product.variants.length > 0) {
            const variant = product.variants.find((v)=>v.size === size && v.color === color);
            if (!variant) throw new _common.NotFoundException('Variant not found');
            if (qty > variant.stock) throw new _common.BadRequestException('Not enough stock for this variant');
        } else {
            // Fall back to general stock check
            if (qty > item.countInStock) throw new _common.BadRequestException('Not enough stock');
        }
        item.qty = qty;
        this.calculatePrices(cart);
        return cart.save();
    }
    async clearCart(user) {
        const cart = await this.getCart(user);
        cart.items = [];
        this.calculatePrices(cart);
        return cart.save();
    }
    validateShippingDetails(shippingDetails) {
        const { address, city, postalCode, country } = shippingDetails;
        if (!address || !city || !postalCode || !country) {
            throw new _common.BadRequestException('All shipping fields are required');
        }
        return shippingDetails;
    }
    validatePaymentMethod(paymentMethod) {
        console.log('Received payment method:', paymentMethod);
        console.log('Type of payment method:', typeof paymentMethod);
        const validMethods = [
            'PayPal',
            'Stripe',
            'BOG'
        ];
        console.log('Valid methods:', validMethods);
        console.log('Is payment method in valid methods?', validMethods.includes(paymentMethod));
        if (!validMethods.includes(paymentMethod)) {
            console.log('Payment method validation failed!');
            throw new _common.BadRequestException('Invalid payment method');
        }
        console.log('Payment method validation passed!');
        return paymentMethod;
    }
    constructor(cartModel, productsService){
        this.cartModel = cartModel;
        this.productsService = productsService;
    }
};
CartService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_cartschema.Cart.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService
    ])
], CartService);

//# sourceMappingURL=cart.service.js.map