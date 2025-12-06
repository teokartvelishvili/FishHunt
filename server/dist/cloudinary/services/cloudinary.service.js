"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CloudinaryService", {
    enumerable: true,
    get: function() {
        return CloudinaryService;
    }
});
const _common = require("@nestjs/common");
const _cloudinary = require("cloudinary");
const _stream = require("stream");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CloudinaryService = class CloudinaryService {
    async uploadImage(file) {
        return new Promise((resolve, reject)=>{
            const upload = _cloudinary.v2.uploader.upload_stream({
                folder: 'ecommerce'
            }, (error, result)=>{
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result);
            });
            const stream = _stream.Readable.from(file.buffer);
            stream.pipe(upload);
        });
    }
    async uploadImages(images) {
        const uploadPromises = images.map(async (imageUrl)=>{
            const response = await fetch(imageUrl);
            const buffer = Buffer.from(await response.arrayBuffer());
            return new Promise((resolve, reject)=>{
                const upload = _cloudinary.v2.uploader.upload_stream({
                    folder: 'products'
                }, (error, result)=>{
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result?.secure_url || '');
                });
                const stream = _stream.Readable.from(buffer);
                stream.pipe(upload);
            });
        });
        return Promise.all(uploadPromises);
    }
    async uploadBuffer(buffer) {
        return new Promise((resolve, reject)=>{
            const upload = _cloudinary.v2.uploader.upload_stream({
                folder: 'products'
            }, (error, result)=>{
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result?.secure_url || '');
            });
            const stream = _stream.Readable.from(buffer);
            stream.pipe(upload);
        });
    }
};
CloudinaryService = _ts_decorate([
    (0, _common.Injectable)()
], CloudinaryService);

//# sourceMappingURL=cloudinary.service.js.map