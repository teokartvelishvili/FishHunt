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
    get connectDB () {
        return connectDB;
    },
    get corsConfig () {
        return corsConfig;
    }
});
const connectDB = (configService)=>({
        uri: configService.get('MONGODB_URI'),
        autoIndex: true
    });
const corsConfig = ()=>({
        origin: process.env.CLIENT_URL,
        methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        credentials: true
    });

//# sourceMappingURL=config.js.map