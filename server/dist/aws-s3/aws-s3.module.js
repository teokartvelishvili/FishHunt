"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsS3Module", {
    enumerable: true,
    get: function() {
        return AwsS3Module;
    }
});
const _common = require("@nestjs/common");
const _awss3service = require("./aws-s3.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AwsS3Module = class AwsS3Module {
};
AwsS3Module = _ts_decorate([
    (0, _common.Module)({
        providers: [
            _awss3service.AwsS3Service
        ],
        exports: [
            _awss3service.AwsS3Service
        ]
    })
], AwsS3Module);

//# sourceMappingURL=aws-s3.module.js.map