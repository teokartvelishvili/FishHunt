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
    get Serialize () {
        return Serialize;
    },
    get SerializeInterceptor () {
        return SerializeInterceptor;
    }
});
const _common = require("@nestjs/common");
const _operators = require("rxjs/operators");
const _classtransformer = require("class-transformer");
const Serialize = (dto)=>{
    return (0, _common.UseInterceptors)(new SerializeInterceptor(dto));
};
let SerializeInterceptor = class SerializeInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, _operators.map)((data)=>{
            return (0, _classtransformer.plainToClass)(this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    }
    constructor(dto){
        this.dto = dto;
    }
};

//# sourceMappingURL=serialize.interceptor.js.map