"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsS3Service", {
    enumerable: true,
    get: function() {
        return AwsS3Service;
    }
});
const _clients3 = require("@aws-sdk/client-s3");
const _common = require("@nestjs/common");
const _s3requestpresigner = require("@aws-sdk/s3-request-presigner");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AwsS3Service = class AwsS3Service {
    async uploadImage(filePath, file) {
        if (!filePath || !file) throw new _common.BadRequestException('filepath or file require');
        const config = {
            Key: filePath,
            Bucket: this.bucketName,
            Body: file
        };
        const uploadCommand = new _clients3.PutObjectCommand(config);
        await this.s3.send(uploadCommand);
        return filePath;
    }
    async getImageByFileId(fileId) {
        if (!fileId) return null;
        try {
            // Instead of downloading the file and converting to base64,
            // generate a pre-signed URL that provides temporary access to the object
            const command = new _clients3.GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileId
            });
            // Generate a signed URL that expires in 24 hours (86400 seconds)
            const signedUrl = await (0, _s3requestpresigner.getSignedUrl)(this.s3, command, {
                expiresIn: 86400
            });
            return signedUrl;
        } catch (error) {
            console.error(`Error generating signed URL for ${fileId}:`, error);
            return null;
        }
    }
    async deleteImageByFileId(fileId) {
        if (!fileId) throw new _common.BadRequestException('file id required');
        const config = {
            Key: fileId,
            Bucket: this.bucketName
        };
        const deleteCommand = new _clients3.DeleteObjectCommand(config);
        await this.s3.send(deleteCommand);
        return `image ${fileId} deleted`;
    }
    constructor(){
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.s3 = new _clients3.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
            region: process.env.AWS_REGION
        });
    }
};
AwsS3Service = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], AwsS3Service);

//# sourceMappingURL=aws-s3.service.js.map