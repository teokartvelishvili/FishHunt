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
    get Order () {
        return Order;
    },
    get OrderSchema () {
        return OrderSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = /*#__PURE__*/ _interop_require_wildcard(require("mongoose"));
const _interfaces = require("../../interfaces");
const _userschema = require("../../users/schemas/user.schema");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
let Order = class Order {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }),
    _ts_metadata("design:type", typeof _userschema.User === "undefined" ? Object : _userschema.User)
], Order.prototype, "user", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        type: [
            {
                name: {
                    required: true,
                    type: String
                },
                nameEn: {
                    required: false,
                    type: String
                },
                qty: {
                    required: true,
                    type: Number
                },
                image: {
                    required: true,
                    type: String
                },
                price: {
                    required: true,
                    type: Number
                },
                size: {
                    required: false,
                    type: String
                },
                color: {
                    required: false,
                    type: String
                },
                ageGroup: {
                    required: false,
                    type: String
                },
                productId: {
                    type: _mongoose1.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                product: {
                    type: {
                        deliveryType: {
                            type: String
                        },
                        minDeliveryDays: {
                            type: Number
                        },
                        maxDeliveryDays: {
                            type: Number
                        },
                        dimensions: {
                            type: {
                                width: {
                                    type: Number
                                },
                                height: {
                                    type: Number
                                },
                                depth: {
                                    type: Number
                                }
                            }
                        }
                    }
                }
            }
        ]
    }),
    _ts_metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        type: {
            address: {
                required: true,
                type: String
            },
            city: {
                required: true,
                type: String
            },
            postalCode: {
                required: true,
                type: String
            },
            country: {
                required: true,
                type: String
            }
        }
    }),
    _ts_metadata("design:type", typeof _interfaces.ShippingDetails === "undefined" ? Object : _interfaces.ShippingDetails)
], Order.prototype, "shippingDetails", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false,
        type: {
            id: {
                required: true,
                type: String
            },
            status: {
                required: true,
                type: String
            },
            update_time: {
                required: true,
                type: String
            },
            email_address: {
                required: true,
                type: String
            }
        }
    }),
    _ts_metadata("design:type", typeof _interfaces.PaymentResult === "undefined" ? Object : _interfaces.PaymentResult)
], Order.prototype, "paymentResult", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0.0
    }),
    _ts_metadata("design:type", Number)
], Order.prototype, "taxPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0.0
    }),
    _ts_metadata("design:type", Number)
], Order.prototype, "shippingPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0.0
    }),
    _ts_metadata("design:type", Number)
], Order.prototype, "itemsPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        default: 0.0
    }),
    _ts_metadata("design:type", Number)
], Order.prototype, "totalPrice", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Order.prototype, "isPaid", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "paidAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Order.prototype, "isDelivered", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "deliveredAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Order.prototype, "cancelledAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false,
        unique: true,
        sparse: true
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "externalOrderId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        enum: [
            'pending',
            'paid',
            'delivered',
            'cancelled'
        ],
        default: 'pending'
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "status", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Order.prototype, "statusReason", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Date,
        default: ()=>new Date(Date.now() + 10 * 60 * 1000)
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Order.prototype, "stockReservationExpires", void 0);
Order = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Order);
const OrderSchema = _mongoose.SchemaFactory.createForClass(Order);

//# sourceMappingURL=order.schema.js.map