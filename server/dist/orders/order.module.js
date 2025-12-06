"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderModule", {
    enumerable: true,
    get: function() {
        return OrderModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _orderscontroller = require("./controller/orders.controller");
const _orderschema = require("./schemas/order.schema");
const _ordersservice = require("./services/orders.service");
const _stockreservationservice = require("./services/stock-reservation.service");
const _productsmodule = require("../products/products.module");
const _emailservices = require("../email/services/email.services");
const _userschema = require("../users/schemas/user.schema");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OrderModule = class OrderModule {
};
OrderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _orderschema.Order.name,
                    schema: _orderschema.OrderSchema
                },
                {
                    name: _userschema.User.name,
                    schema: _userschema.UserSchema
                }
            ]),
            _productsmodule.ProductsModule
        ],
        controllers: [
            _orderscontroller.OrdersController
        ],
        providers: [
            _ordersservice.OrdersService,
            _stockreservationservice.StockReservationService,
            _emailservices.EmailService
        ],
        exports: [
            _ordersservice.OrdersService,
            _stockreservationservice.StockReservationService
        ]
    })
], OrderModule);

//# sourceMappingURL=order.module.js.map