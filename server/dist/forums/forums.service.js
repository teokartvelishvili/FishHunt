"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumsService", {
    enumerable: true,
    get: function() {
        return ForumsService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _forumschema = require("./schema/forum.schema");
const _mongoose1 = require("mongoose");
const _usersservice = require("../users/services/users.service");
const _awss3service = require("../aws-s3/aws-s3.service");
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
let ForumsService = class ForumsService {
    async create(createForumDto, userId, filePath, file) {
        try {
            const user = await this.userService.findById(userId);
            if (!Object.keys(user).length) throw new _common.BadRequestException('user not found');
            if ('_id' in user) {
                if (!filePath && !file) {
                    const forum = await this.forumModel.create({
                        ...createForumDto,
                        user: user._id
                    });
                    return forum;
                }
                const imagePath = await this.awsS3Service.uploadImage(filePath, file);
                const forum = await this.forumModel.create({
                    ...createForumDto,
                    user: user._id,
                    imagePath
                });
                return forum;
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new _common.BadRequestException(error.message);
            }
        }
    }
    async findAll(queryParams) {
        const { page, take } = queryParams;
        const limit = Math.min(take, 20);
        const forumData = await this.forumModel.find().sort({
            createdAt: -1
        }).skip((page - 1) * limit).limit(limit).populate('user', 'name _id role profileImagePath').populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name _id profileImagePath'
            }
        });
        const forumDataWithImages = await Promise.all(forumData.map(async (forum)=>{
            // Get forum post image
            const imageUrl = await this.awsS3Service.getImageByFileId(forum.imagePath);
            // Get user profile image if available
            let userProfileImage = null;
            const populatedUser = forum.user; // Cast to any to access properties
            if (populatedUser && populatedUser.profileImagePath) {
                userProfileImage = await this.awsS3Service.getImageByFileId(populatedUser.profileImagePath);
            }
            // Create a safe user object
            const userObj = typeof populatedUser === 'string' ? {
                _id: populatedUser,
                name: 'Unknown',
                role: 'user'
            } : populatedUser && typeof populatedUser.toObject === 'function' ? populatedUser.toObject() : populatedUser;
            // Get comment authors profile images
            const commentsWithProfileImages = await Promise.all(forum.comments.map(async (comment)=>{
                let commentUserProfileImage = null;
                const populatedCommentUser = comment.user; // Cast to any
                if (populatedCommentUser && populatedCommentUser.profileImagePath) {
                    commentUserProfileImage = await this.awsS3Service.getImageByFileId(populatedCommentUser.profileImagePath);
                }
                // Create a safe comment user object
                const commentUserObj = typeof populatedCommentUser === 'string' ? {
                    _id: populatedCommentUser,
                    name: 'Unknown'
                } : populatedCommentUser && typeof populatedCommentUser.toObject === 'function' ? populatedCommentUser.toObject() : populatedCommentUser;
                return {
                    ...comment.toObject(),
                    user: {
                        ...commentUserObj,
                        profileImage: commentUserProfileImage
                    }
                };
            }));
            return {
                ...forum.toObject(),
                image: imageUrl,
                user: {
                    ...userObj,
                    profileImage: userProfileImage
                },
                comments: commentsWithProfileImages
            };
        }));
        return forumDataWithImages;
    }
    async addCommentForum(userId, forumId, addCommentDto) {
        if (!(0, _mongoose1.isValidObjectId)(forumId)) throw new _common.BadRequestException('invalid mongo id');
        const forum = await this.forumModel.findById(forumId);
        if (!forum) throw new _common.BadRequestException('forum not found');
        const updatedForum = await this.forumModel.findByIdAndUpdate(forumId, {
            $push: {
                comments: {
                    user: userId,
                    content: addCommentDto.content
                }
            }
        }, {
            new: true
        });
        return updatedForum;
    }
    async addLikeForum(userId, forumId) {
        if (!(0, _mongoose1.isValidObjectId)(forumId)) throw new _common.BadRequestException('invalid mongo id');
        const forum = await this.forumModel.findById(forumId);
        if (!forum) throw new _common.BadRequestException('forum not found');
        if (forum.likesArray.includes(userId)) {
            throw new _common.BadRequestException('User has already liked this post');
        }
        await this.forumModel.findByIdAndUpdate(forumId, {
            $push: {
                likesArray: userId
            },
            $inc: {
                likes: 1
            }
        });
        return {
            message: 'forum liked'
        };
    }
    async removeLikeForum(userId, forumId) {
        if (!(0, _mongoose1.isValidObjectId)(forumId)) throw new _common.BadRequestException('invalid mongo id');
        const forum = await this.forumModel.findById(forumId);
        if (!forum) throw new _common.BadRequestException('forum not found');
        if (!forum.likesArray.includes(userId)) {
            throw new _common.BadRequestException('User has not liked this post');
        }
        await this.forumModel.findByIdAndUpdate(forumId, {
            $pull: {
                likesArray: userId
            },
            $inc: {
                likes: -1
            }
        });
        return {
            message: 'forum disliked'
        };
    }
    async findOne(id) {
        const forum = await this.forumModel.findById(id).populate('user', 'name role profileImage').populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name profileImage'
            }
        }).exec();
        if (!forum) {
            throw new Error('Forum post not found');
        }
        // Get forum post image from S3
        const imageUrl = await this.awsS3Service.getImageByFileId(forum.imagePath);
        // Convert to plain object and add image URL
        const forumObject = forum.toObject();
        return {
            ...forumObject,
            image: imageUrl
        };
    }
    async update(id, updateForumDto, userId, userRole, filePath, file) {
        if (!(0, _mongoose1.isValidObjectId)(id)) {
            throw new _common.BadRequestException('Invalid forum ID');
        }
        const forum = await this.forumModel.findById(id);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const isAdmin = userRole === 'admin';
        const isOwner = forum.user.toString() === userId.toString();
        console.log('Update method values:', {
            forumUserId: forum.user.toString(),
            receivedUserId: userId,
            userRole,
            isAdmin,
            isOwner
        });
        // Allow update if user is admin or is the post owner
        if (!isAdmin && !isOwner) {
            throw new _common.UnauthorizedException('You can only edit your own posts');
        }
        let imagePath = forum.imagePath;
        if (filePath && file) {
            imagePath = await this.awsS3Service.uploadImage(filePath, file);
        }
        const updatedForum = await this.forumModel.findByIdAndUpdate(id, {
            ...updateForumDto,
            imagePath
        }, {
            new: true
        }).populate('user', 'name _id role');
        return updatedForum;
    }
    async remove(forumId, userId, userRole) {
        const forum = await this.forumModel.findById(forumId);
        if (!forum) throw new _common.BadRequestException('forum not found');
        const isAdmin = userRole === 'admin';
        const isOwner = forum.user.toString() === userId.toString();
        console.log('Delete Post values:', {
            forumUserId: forum.user.toString(),
            receivedUserId: userId,
            userRole,
            isAdmin,
            isOwner
        });
        // Allow deletion if user is admin or is the post owner
        if (!isAdmin && !isOwner) {
            throw new _common.UnauthorizedException('You can only delete your own posts');
        }
        const deletedForum = await this.forumModel.findByIdAndDelete(forumId);
        const fileId = deletedForum.imagePath;
        if (fileId) {
            try {
                await this.awsS3Service.deleteImageByFileId(fileId);
            } catch (error) {
                throw new _common.BadRequestException('Failed to delete the image from S3');
            }
        }
        return {
            message: 'Post successfully deleted'
        };
    }
    async replyToComment(userId, commentId, content) {
        if (!(0, _mongoose1.isValidObjectId)(commentId)) {
            throw new _common.BadRequestException('Invalid comment ID');
        }
        const parentComment = await this.commentModel.findById(commentId);
        if (!parentComment) {
            throw new _common.BadRequestException('Comment not found');
        }
        const newReply = await this.commentModel.create({
            user: userId,
            content,
            parentComment: commentId
        });
        // შვილობილი კომენტარის ბმული მშობელთან
        await this.commentModel.findByIdAndUpdate(commentId, {
            $push: {
                replies: newReply._id
            }
        });
        return newReply;
    }
    async addReplyToComment(forumId, commentId, userId, content) {
        if (!(0, _mongoose1.isValidObjectId)(forumId) || !(0, _mongoose1.isValidObjectId)(commentId)) {
            throw new _common.BadRequestException('Invalid ID format');
        }
        const forum = await this.forumModel.findById(forumId);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const newComment = await this.commentModel.create({
            user: new _mongoose1.Types.ObjectId(userId),
            content,
            parentId: new _mongoose1.Types.ObjectId(commentId),
            replies: []
        });
        // ვამატებთ ახალ კომენტარს ფორუმში
        await this.forumModel.findByIdAndUpdate(forumId, {
            $push: {
                comments: newComment
            }
        }, {
            new: true
        });
        // ვამატებთ reply-ს მშობელ კომენტარში
        await this.forumModel.updateOne({
            _id: forumId,
            'comments._id': commentId
        }, {
            $push: {
                'comments.$.replies': newComment._id
            }
        });
        return this.forumModel.findById(forumId).populate({
            path: 'comments.user',
            select: 'name _id'
        });
    }
    async deleteComment(forumId, commentId, userId, isAdmin) {
        const forum = await this.forumModel.findById(forumId);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const commentIndex = forum.comments.findIndex((comment)=>comment._id.toString() === commentId);
        if (commentIndex === -1) {
            throw new _common.NotFoundException('Comment not found');
        }
        const comment = forum.comments[commentIndex];
        console.log('Delete Comment values:', {
            commentUserId: comment.user.toString(),
            receivedUserId: userId,
            isAdmin,
            isMatch: comment.user.toString() === userId.toString()
        });
        if (!isAdmin && comment.user.toString() !== userId.toString()) {
            throw new _common.UnauthorizedException('You can only delete your own comments');
        }
        // რეკურსიულად წავშალოთ ყველა reply
        const deleteReplies = (commentId)=>{
            forum.comments = forum.comments.filter((comment)=>{
                if (comment.parentId?.toString() === commentId) {
                    deleteReplies(comment._id.toString());
                    return false;
                }
                return true;
            });
        };
        deleteReplies(comment._id.toString());
        forum.comments.splice(commentIndex, 1);
        await forum.save();
        return this.forumModel.findById(forumId).populate({
            path: 'comments.user',
            select: 'name _id'
        });
    }
    async editComment(forumId, commentId, userId, content, isAdmin) {
        const forum = await this.forumModel.findById(forumId);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const comment = forum.comments.find((comment)=>comment._id.toString() === commentId);
        if (!comment) {
            throw new _common.NotFoundException('Comment not found');
        }
        console.log('Edit Comment values:', {
            commentUserId: comment.user.toString(),
            receivedUserId: userId,
            isAdmin,
            isMatch: comment.user.toString() === userId.toString()
        });
        if (!isAdmin && comment.user.toString() !== userId.toString()) {
            throw new _common.UnauthorizedException('You can only edit your own comments');
        }
        comment.content = content;
        await forum.save();
        return this.forumModel.findById(forumId).populate({
            path: 'comments.user',
            select: 'name _id'
        });
    }
    async addCommentLike(forumId, commentId, userId) {
        if (!(0, _mongoose1.isValidObjectId)(forumId) || !(0, _mongoose1.isValidObjectId)(commentId)) {
            throw new _common.BadRequestException('Invalid ID format');
        }
        const forum = await this.forumModel.findById(forumId);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const commentIndex = forum.comments.findIndex((c)=>c._id.toString() === commentId);
        if (commentIndex === -1) {
            throw new _common.NotFoundException('Comment not found');
        }
        const comment = forum.comments[commentIndex];
        // Initialize likesArray if it doesn't exist
        if (!comment.likesArray) {
            comment.likesArray = [];
        }
        // Convert likesArray elements to strings for comparison
        const userIdStr = userId.toString();
        const alreadyLiked = comment.likesArray.some((id)=>id.toString() === userIdStr);
        // Check if user already liked this comment
        if (alreadyLiked) {
            throw new _common.BadRequestException('User already liked this comment');
        }
        // Add like
        comment.likesArray.push(userId);
        comment.likes = comment.likesArray.length;
        await forum.save();
        return {
            message: 'Comment liked successfully',
            likes: comment.likes
        };
    }
    async removeCommentLike(forumId, commentId, userId) {
        if (!(0, _mongoose1.isValidObjectId)(forumId) || !(0, _mongoose1.isValidObjectId)(commentId)) {
            throw new _common.BadRequestException('Invalid ID format');
        }
        const forum = await this.forumModel.findById(forumId);
        if (!forum) {
            throw new _common.NotFoundException('Forum not found');
        }
        const commentIndex = forum.comments.findIndex((c)=>c._id.toString() === commentId);
        if (commentIndex === -1) {
            throw new _common.NotFoundException('Comment not found');
        }
        const comment = forum.comments[commentIndex];
        // Initialize likesArray if it doesn't exist
        if (!comment.likesArray) {
            comment.likesArray = [];
            throw new _common.BadRequestException('User has not liked this comment');
        }
        // Convert user ID to string for comparison
        const userIdStr = userId.toString();
        const hasLiked = comment.likesArray.some((id)=>id.toString() === userIdStr);
        // Check if user has liked this comment
        if (!hasLiked) {
            throw new _common.BadRequestException('User has not liked this comment');
        }
        // Remove like
        comment.likesArray = comment.likesArray.filter((id)=>id.toString() !== userIdStr);
        comment.likes = comment.likesArray.length;
        await forum.save();
        return {
            message: 'Comment like removed successfully',
            likes: comment.likes
        };
    }
    constructor(forumModel, commentModel, userService, awsS3Service){
        this.forumModel = forumModel;
        this.commentModel = commentModel;
        this.userService = userService;
        this.awsS3Service = awsS3Service;
    }
};
ForumsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_forumschema.Forum.name)),
    _ts_param(1, (0, _mongoose.InjectModel)(_forumschema.Comment.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _awss3service.AwsS3Service === "undefined" ? Object : _awss3service.AwsS3Service
    ])
], ForumsService);

//# sourceMappingURL=forums.service.js.map