"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HasValidUserId", {
    enumerable: true,
    get: function() {
        return HasValidUserId;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("mongoose");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let HasValidUserId = class HasValidUserId {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        if (!headers['user-id']) {
            throw new _common.BadRequestException('user id not provided');
        }
        if (!(0, _mongoose.isValidObjectId)(headers['user-id'])) {
            throw new _common.BadRequestException('user id is not valid');
        }
        request.userId = headers['user-id'];
        return true;
    }
};
HasValidUserId = _ts_decorate([
    (0, _common.Injectable)()
], HasValidUserId);

//# sourceMappingURL=hasValidUserId.guard.js.map