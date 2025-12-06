"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Cart () {
        return Cart;
    },
    get CartItem () {
        return CartItem;
    },
    get CartItemSchema () {
        return CartItemSchema;
    },
    get CartSchema () {
        return CartSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
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
let CartItem = class CartItem {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        type: String
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "productId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "nameEn", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "image", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], CartItem.prototype, "countInStock", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 1
    }),
    _ts_metadata("design:type", Number)
], CartItem.prototype, "qty", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false,
        type: String
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "size", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false,
        type: String
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "color", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false,
        type: String
    }),
    _ts_metadata("design:type", String)
], CartItem.prototype, "ageGroup", void 0);
CartItem = _ts_decorate([
    (0, _mongoose.Schema)()
], CartItem);
const CartItemSchema = _mongoose.SchemaFactory.createForClass(CartItem);
let Cart = class Cart {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }),
    _ts_metadata("design:type", typeof _userschema.User === "undefined" ? Object : _userschema.User)
], Cart.prototype, "userId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            CartItemSchema
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Cart.prototype, "items", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Cart.prototype, "itemsPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Cart.prototype, "taxPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Cart.prototype, "shippingPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Cart.prototype, "totalPrice", void 0);
Cart = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Cart);
const CartSchema = _mongoose.SchemaFactory.createForClass(Cart);

//# sourceMappingURL=cart.schema.js.map