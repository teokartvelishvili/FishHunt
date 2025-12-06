"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _cartcontroller = require("./cart.controller");
describe('CartController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _cartcontroller.CartController
            ]
        }).compile();
        controller = module.get(_cartcontroller.CartController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=cart.controller.spec.js.map