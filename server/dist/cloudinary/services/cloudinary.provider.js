"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CloudinaryProvider", {
    enumerable: true,
    get: function() {
        return CloudinaryProvider;
    }
});
const _cloudinary = require("cloudinary");
const _constants = require("../constants");
const CloudinaryProvider = {
    provide: _constants.CLOUDINARY,
    useFactory: ()=>{
        return _cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
};

//# sourceMappingURL=cloudinary.provider.js.map