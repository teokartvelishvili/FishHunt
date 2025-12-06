"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateForumDto", {
    enumerable: true,
    get: function() {
        return CreateForumDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateForumDto = class CreateForumDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'some fishing and hunting content'
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateForumDto.prototype, "content", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: [
            'Fishing',
            'Hunting',
            'other'
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayNotEmpty)(),
    (0, _classvalidator.ArrayUnique)(),
    _ts_metadata("design:type", Array)
], CreateForumDto.prototype, "tags", void 0);

//# sourceMappingURL=create-forum.dto.js.map