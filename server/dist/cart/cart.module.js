"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartModule", {
    enumerable: true,
    get: function() {
        return CartModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _cartcontroller = require("./controller/cart.controller");
const _cartservice = require("./services/cart.service");
const _cartschema = require("./schemas/cart.schema");
const _productsmodule = require("../products/products.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CartModule = class CartModule {
};
CartModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _cartschema.Cart.name,
                    schema: _cartschema.CartSchema
                }
            ]),
            _productsmodule.ProductsModule
        ],
        controllers: [
            _cartcontroller.CartController
        ],
        providers: [
            _cartservice.CartService
        ],
        exports: [
            _cartservice.CartService
        ]
    })
], CartModule);

//# sourceMappingURL=cart.module.js.map