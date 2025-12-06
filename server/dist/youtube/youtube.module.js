"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "YoutubeModule", {
    enumerable: true,
    get: function() {
        return YoutubeModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _youtubeservice = require("./youtube.service");
const _youtubecontroller = require("./youtube.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let YoutubeModule = class YoutubeModule {
};
YoutubeModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule
        ],
        controllers: [
            _youtubecontroller.YoutubeController
        ],
        providers: [
            _youtubeservice.YoutubeService
        ],
        exports: [
            _youtubeservice.YoutubeService
        ]
    })
], YoutubeModule);

//# sourceMappingURL=youtube.module.js.map