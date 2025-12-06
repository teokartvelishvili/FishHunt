"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "YoutubeController", {
    enumerable: true,
    get: function() {
        return YoutubeController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _express = require("express");
const _youtubeservice = require("./youtube.service");
const _swagger = require("@nestjs/swagger");
const _multer = require("multer");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _jwtauthguard = require("../guards/jwt-auth.guard");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let YoutubeController = class YoutubeController {
    /**
   * OAuth ავტორიზაციის URL-ის მიღება
   * პირველადი setup-ისთვის
   */ getAuthUrl() {
        const authUrl = this.youtubeService.getAuthUrl();
        return {
            authUrl,
            message: 'Visit this URL to authorize the application'
        };
    }
    /**
   * OAuth Callback
   * Google-ისგან redirect-ის შემდეგ
   */ async oauth2callback(code, res) {
        try {
            if (!code) {
                throw new _common.HttpException('Authorization code is required', _common.HttpStatus.BAD_REQUEST);
            }
            const tokens = await this.youtubeService.getTokenFromCode(code);
            // წარმატების შემთხვევაში გადამისამართება
            return res.send(`
        <html>
          <body>
            <h2>✅ Authorization Successful!</h2>
            <p>Refresh Token: <code>${tokens.refresh_token}</code></p>
            <p>Please copy the refresh token above and add it to your .env file:</p>
            <pre>YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
            <p>You can close this window now.</p>
          </body>
        </html>
      `);
        } catch (error) {
            return res.status(500).send(`
        <html>
          <body>
            <h2>❌ Authorization Failed</h2>
            <p>Error: ${error.message}</p>
          </body>
        </html>
      `);
        }
    }
    /**
   * ვიდეოს ატვირთვა YouTube-ზე
   */ async uploadVideo(file, body) {
        if (!file) {
            throw new _common.HttpException('Video file is required', _common.HttpStatus.BAD_REQUEST);
        }
        try {
            const options = {
                title: body.title,
                description: body.description,
                tags: body.tags ? body.tags.split(',').map((tag)=>tag.trim()) : [],
                privacyStatus: body.privacyStatus || 'public'
            };
            const result = await this.youtubeService.uploadVideo(file.path, options);
            // ფაილის წაშლა upload-ის შემდეგ
            _fs.unlinkSync(file.path);
            return {
                success: true,
                message: 'Video uploaded successfully',
                ...result
            };
        } catch (error) {
            // წაშლის მცდელობა error-ის შემთხვევაშიც
            if (file && _fs.existsSync(file.path)) {
                _fs.unlinkSync(file.path);
            }
            throw error;
        }
    }
    /**
   * ვიდეოს წაშლა
   */ async deleteVideo(videoId) {
        await this.youtubeService.deleteVideo(videoId);
        return {
            success: true,
            message: 'Video deleted successfully'
        };
    }
    /**
   * Playlist-ის შექმნა
   */ async createPlaylist(body) {
        const playlistId = await this.youtubeService.createPlaylist(body.title, body.description, body.privacyStatus || 'public');
        return {
            success: true,
            message: 'Playlist created successfully',
            playlistId,
            playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`
        };
    }
    /**
   * არხის ინფორმაცია
   */ async getChannelInfo() {
        const channelInfo = await this.youtubeService.getChannelInfo();
        return {
            success: true,
            channel: channelInfo
        };
    }
    constructor(youtubeService){
        this.youtubeService = youtubeService;
    }
};
_ts_decorate([
    (0, _common.Get)('auth'),
    (0, _swagger.ApiOperation)({
        summary: 'Get YouTube OAuth authorization URL'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], YoutubeController.prototype, "getAuthUrl", null);
_ts_decorate([
    (0, _common.Get)('oauth2callback'),
    (0, _swagger.ApiOperation)({
        summary: 'OAuth2 callback endpoint'
    }),
    _ts_param(0, (0, _common.Query)('code')),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], YoutubeController.prototype, "oauth2callback", null);
_ts_decorate([
    (0, _common.Post)('upload'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('video', {
        storage: (0, _multer.diskStorage)({
            destination: './uploads/videos',
            filename: (req, file, cb)=>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = _path.extname(file.originalname);
                cb(null, `video-${uniqueSuffix}${ext}`);
            }
        }),
        limits: {
            fileSize: 500 * 1024 * 1024
        },
        fileFilter: (req, file, cb)=>{
            const allowedMimes = [
                'video/mp4',
                'video/mpeg',
                'video/quicktime',
                'video/x-msvideo',
                'video/x-flv',
                'video/x-ms-wmv'
            ];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new _common.HttpException('Only video files are allowed', _common.HttpStatus.BAD_REQUEST), false);
            }
        }
    })),
    (0, _swagger.ApiOperation)({
        summary: 'Upload video to YouTube'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    format: 'binary'
                },
                title: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                tags: {
                    type: 'string',
                    description: 'Comma-separated tags'
                },
                privacyStatus: {
                    type: 'string',
                    enum: [
                        'public',
                        'private',
                        'unlisted'
                    ],
                    default: 'public'
                }
            }
        }
    }),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], YoutubeController.prototype, "uploadVideo", null);
_ts_decorate([
    (0, _common.Delete)('video/:videoId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Delete video from YouTube'
    }),
    _ts_param(0, (0, _common.Param)('videoId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], YoutubeController.prototype, "deleteVideo", null);
_ts_decorate([
    (0, _common.Post)('playlist'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new playlist'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], YoutubeController.prototype, "createPlaylist", null);
_ts_decorate([
    (0, _common.Get)('channel'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Get YouTube channel information'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], YoutubeController.prototype, "getChannelInfo", null);
YoutubeController = _ts_decorate([
    (0, _swagger.ApiTags)('youtube'),
    (0, _common.Controller)('youtube'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _youtubeservice.YoutubeService === "undefined" ? Object : _youtubeservice.YoutubeService
    ])
], YoutubeController);

//# sourceMappingURL=youtube.controller.js.map