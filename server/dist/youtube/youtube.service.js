"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "YoutubeService", {
    enumerable: true,
    get: function() {
        return YoutubeService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _googleapis = require("googleapis");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
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
let YoutubeService = class YoutubeService {
    /**
   * OAuth2 Client-ის ინიციალიზაცია
   */ initializeOAuth() {
        const clientId = this.configService.get('YOUTUBE_CLIENT_ID');
        const clientSecret = this.configService.get('YOUTUBE_CLIENT_SECRET');
        const redirectUri = this.configService.get('YOUTUBE_REDIRECT_URI');
        if (!clientId || !clientSecret || !redirectUri) {
            this.logger.warn('YouTube API credentials are not configured');
            return;
        }
        this.oauth2Client = new _googleapis.google.auth.OAuth2(clientId, clientSecret, redirectUri);
        // Refresh Token-ის დატვირთვა
        const refreshToken = this.configService.get('YOUTUBE_REFRESH_TOKEN');
        if (refreshToken) {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken
            });
        }
        this.youtube = _googleapis.google.youtube({
            version: 'v3',
            auth: this.oauth2Client
        });
        this.logger.log('YouTube API initialized successfully');
    }
    /**
   * Ensures OAuth client და youtube SDK მზადაა სანამ მოთხოვნას შევასრულებთ
   */ ensureYoutubeClient() {
        if (!this.oauth2Client || !this.youtube) {
            this.initializeOAuth();
        }
        if (!this.oauth2Client || !this.youtube) {
            this.logger.error('YouTube API is not initialized. Check environment variables.');
            throw new _common.HttpException('YouTube API credentials are not configured on the server', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * Authorization URL-ის გენერირება
   * პირველადი ავტორიზაციისთვის
   */ getAuthUrl() {
        this.ensureYoutubeClient();
        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }
    /**
   * Authorization Code-ით Token-ის მიღება
   */ async getTokenFromCode(code) {
        this.ensureYoutubeClient();
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            this.logger.log('Tokens received successfully');
            this.logger.log('Refresh Token:', tokens.refresh_token);
            return tokens;
        } catch (error) {
            this.logger.error('Error getting tokens:', error);
            throw new _common.HttpException('Failed to get authentication tokens', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * ვიდეოს ატვირთვა YouTube-ზე
   * @param filePath - ვიდეო ფაილის path
   * @param options - ვიდეოს metadata
   * @returns YouTube video URL
   */ async uploadVideo(filePath, options) {
        try {
            this.ensureYoutubeClient();
            if (!_fs.existsSync(filePath)) {
                throw new _common.HttpException('Video file not found', _common.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Starting upload for: ${options.title}`);
            const fileSize = _fs.statSync(filePath).size;
            const fileSizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
            this.logger.log(`File size: ${fileSizeInMB} MB`);
            // ვიდეოს metadata
            const videoMetadata = {
                snippet: {
                    title: options.title,
                    description: options.description,
                    tags: options.tags || [],
                    categoryId: options.categoryId || '22'
                },
                status: {
                    privacyStatus: options.privacyStatus || 'public',
                    selfDeclaredMadeForKids: false
                }
            };
            // ვიდეოს ატვირთვა
            const response = await this.youtube.videos.insert({
                part: [
                    'snippet',
                    'status'
                ],
                requestBody: videoMetadata,
                media: {
                    body: _fs.createReadStream(filePath)
                }
            });
            const videoId = response.data.id;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            this.logger.log(`Video uploaded successfully: ${videoUrl}`);
            // Playlist-ში დამატება
            const playlistId = this.configService.get('YOUTUBE_PLAYLIST_ID');
            if (playlistId) {
                await this.addVideoToPlaylist(videoId, playlistId);
            }
            return {
                videoId,
                videoUrl,
                embedUrl
            };
        } catch (error) {
            this.logger.error('Error uploading video:', error);
            throw new _common.HttpException(`Failed to upload video: ${error.message}`, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * ვიდეოს Playlist-ში დამატება
   */ async addVideoToPlaylist(videoId, playlistId) {
        try {
            this.ensureYoutubeClient();
            await this.youtube.playlistItems.insert({
                part: [
                    'snippet'
                ],
                requestBody: {
                    snippet: {
                        playlistId: playlistId,
                        resourceId: {
                            kind: 'youtube#video',
                            videoId: videoId
                        }
                    }
                }
            });
            this.logger.log(`Video added to playlist: ${playlistId}`);
        } catch (error) {
            this.logger.error('Error adding video to playlist:', error);
        // არ ვიყენებთ throw-ს რომ არ გავშალოთ მთელი upload process
        // თუ playlist-ში დამატება ვერ მოხერხდა
        }
    }
    /**
   * Playlist-ის შექმნა
   */ async createPlaylist(title, description, privacyStatus = 'public') {
        try {
            this.ensureYoutubeClient();
            const response = await this.youtube.playlists.insert({
                part: [
                    'snippet',
                    'status'
                ],
                requestBody: {
                    snippet: {
                        title,
                        description
                    },
                    status: {
                        privacyStatus
                    }
                }
            });
            const playlistId = response.data.id;
            this.logger.log(`Playlist created: ${playlistId}`);
            return playlistId;
        } catch (error) {
            this.logger.error('Error creating playlist:', error);
            throw new _common.HttpException('Failed to create playlist', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * არხის ინფორმაციის მიღება
   */ async getChannelInfo() {
        try {
            this.ensureYoutubeClient();
            const response = await this.youtube.channels.list({
                part: [
                    'snippet',
                    'contentDetails',
                    'statistics'
                ],
                mine: true
            });
            return response.data.items?.[0] || null;
        } catch (error) {
            this.logger.error('Error getting channel info:', error);
            throw new _common.HttpException('Failed to get channel info', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * ვიდეოს წაშლა
   */ async deleteVideo(videoId) {
        try {
            this.ensureYoutubeClient();
            await this.youtube.videos.delete({
                id: videoId
            });
            this.logger.log(`Video deleted: ${videoId}`);
        } catch (error) {
            this.logger.error('Error deleting video:', error);
            throw new _common.HttpException('Failed to delete video', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * ვიდეოს განახლება
   */ async updateVideo(videoId, updates) {
        try {
            this.ensureYoutubeClient();
            const updateData = {
                id: videoId
            };
            if (updates.title || updates.description || updates.tags) {
                updateData.snippet = {};
                if (updates.title) updateData.snippet.title = updates.title;
                if (updates.description) updateData.snippet.description = updates.description;
                if (updates.tags) updateData.snippet.tags = updates.tags;
            }
            if (updates.privacyStatus) {
                updateData.status = {
                    privacyStatus: updates.privacyStatus
                };
            }
            await this.youtube.videos.update({
                part: [
                    'snippet',
                    'status'
                ],
                requestBody: updateData
            });
            this.logger.log(`Video updated: ${videoId}`);
        } catch (error) {
            this.logger.error('Error updating video:', error);
            throw new _common.HttpException('Failed to update video', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(configService){
        this.configService = configService;
        this.logger = new _common.Logger(YoutubeService.name);
        this.initializeOAuth();
    }
};
YoutubeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], YoutubeService);

//# sourceMappingURL=youtube.service.js.map