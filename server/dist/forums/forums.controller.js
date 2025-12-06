"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumsController", {
    enumerable: true,
    get: function() {
        return ForumsController;
    }
});
const _common = require("@nestjs/common");
const _forumsservice = require("./forums.service");
const _createforumdto = require("./dto/create-forum.dto");
const _updateforumdto = require("./dto/update-forum.dto");
const _queryParamsdto = require("./dto/queryParams.dto");
const _platformexpress = require("@nestjs/platform-express");
const _addCommentdto = require("./dto/addComment.dto");
const _jwtauthguard = require("../guards/jwt-auth.guard");
const _currentuserdecorator = require("../decorators/current-user.decorator");
const _types = require("../types");
const _addReplydto = require("./dto/addReply.dto");
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
let ForumsController = class ForumsController {
    create(file, user, createForumDto) {
        if (!user) {
            throw new _common.BadRequestException('User not found');
        }
        if (!file) {
            return this.forumsService.create(createForumDto, user._id);
        }
        console.log('Received file:', {
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        // Check file type more permissively
        const validMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image.heic',
            'image.heif'
        ];
        if (!validMimeTypes.includes(file.mimetype.toLowerCase()) && !file.mimetype.toLowerCase().startsWith('image/')) {
            throw new _common.BadRequestException(`Unsupported file type: ${file.mimetype}. Supported types: JPEG, PNG, GIF, WEBP, HEIC.`);
        }
        const timestamp = Date.now();
        const filePath = `images/${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filesSizeInMb = Number((file.size / (1024 * 1024)).toFixed(1));
        if (filesSizeInMb > 5) {
            throw new _common.BadRequestException('The file must be less than 5 MB.');
        }
        return this.forumsService.create(createForumDto, user._id, filePath, file.buffer);
    }
    findAll(queryParams) {
        return this.forumsService.findAll(queryParams);
    }
    addCommentForum(user, addCommentDto, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.addCommentForum(user._id, forumId, addCommentDto);
    }
    addLikeForum(user, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.addLikeForum(user._id, forumId);
    }
    removeLikeForum(user, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.removeLikeForum(user._id, forumId);
    }
    async addReply(user, addReplyDto, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.addReplyToComment(forumId, addReplyDto.commentId, user._id, addReplyDto.content);
    }
    async addCommentLike(user, body, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        if (!body.commentId) throw new _common.BadRequestException('Comment ID is required');
        return this.forumsService.addCommentLike(forumId, body.commentId, user._id);
    }
    async removeCommentLike(user, body, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        if (!body.commentId) throw new _common.BadRequestException('Comment ID is required');
        return this.forumsService.removeCommentLike(forumId, body.commentId, user._id);
    }
    async deleteComment(user, commentId, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.deleteComment(forumId, commentId, user._id, user.role === 'admin');
    }
    async editComment(user, commentId, editCommentDto, req) {
        const forumId = req.headers['forum-id'];
        if (!forumId) throw new _common.BadRequestException('Forum ID is required');
        return this.forumsService.editComment(forumId, commentId, user._id, editCommentDto.content, user.role === 'admin');
    }
    async findOne(id) {
        return await this.forumsService.findOne(id);
    }
    update(user, id, updateForumDto, file) {
        if (!user) {
            throw new _common.BadRequestException('User authentication required');
        }
        // Pass user role to the service
        if (!file) {
            return this.forumsService.update(id, updateForumDto, user._id, user.role);
        }
        console.log('Update request from:', {
            userId: user._id,
            userName: user.name,
            userRole: user.role
        });
        // Check file type more permissively
        const validMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image.heic',
            'image.heif'
        ];
        if (!validMimeTypes.includes(file.mimetype.toLowerCase()) && !file.mimetype.toLowerCase().startsWith('image/')) {
            throw new _common.BadRequestException(`Unsupported file type: ${file.mimetype}. Supported types: JPEG, PNG, GIF, WEBP, HEIC.`);
        }
        const timestamp = Date.now();
        const filePath = `images/${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const fileBuffer = file.buffer;
        return this.forumsService.update(id, updateForumDto, user._id, user.role, filePath, fileBuffer);
    }
    remove(user, id) {
        if (!user) {
            throw new _common.BadRequestException('User authentication required');
        }
        console.log('Delete request from:', {
            userId: user._id,
            userName: user.name,
            userRole: user.role
        });
        // Pass user role to the service
        return this.forumsService.remove(id, user._id, user.role);
    }
    constructor(forumsService){
        this.forumsService = forumsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        typeof _types.User === "undefined" ? Object : _types.User,
        typeof _createforumdto.CreateForumDto === "undefined" ? Object : _createforumdto.CreateForumDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _queryParamsdto.queryParamsDto === "undefined" ? Object : _queryParamsdto.queryParamsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)('add-comment'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        typeof _addCommentdto.AddCommentDto === "undefined" ? Object : _addCommentdto.AddCommentDto,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "addCommentForum", null);
_ts_decorate([
    (0, _common.Post)('add-like'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "addLikeForum", null);
_ts_decorate([
    (0, _common.Post)('remove-like'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "removeLikeForum", null);
_ts_decorate([
    (0, _common.Post)('add-reply'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        typeof _addReplydto.AddReplyDto === "undefined" ? Object : _addReplydto.AddReplyDto,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "addReply", null);
_ts_decorate([
    (0, _common.Post)('add-comment-like'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        Object,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "addCommentLike", null);
_ts_decorate([
    (0, _common.Post)('remove-comment-like'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        Object,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "removeCommentLike", null);
_ts_decorate([
    (0, _common.Delete)('delete-comment/:commentId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Param)('commentId')),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        String,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "deleteComment", null);
_ts_decorate([
    (0, _common.Put)('edit-comment/:commentId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Param)('commentId')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        String,
        Object,
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "editComment", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ForumsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        String,
        typeof _updateforumdto.UpdateForumDto === "undefined" ? Object : _updateforumdto.UpdateForumDto,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.User === "undefined" ? Object : _types.User,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumsController.prototype, "remove", null);
ForumsController = _ts_decorate([
    (0, _common.Controller)('forums'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _forumsservice.ForumsService === "undefined" ? Object : _forumsservice.ForumsService
    ])
], ForumsController);

//# sourceMappingURL=forums.controller.js.map