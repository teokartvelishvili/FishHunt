import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Forum, ForumDocument, Comment } from './schemas/forum.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { UsersService } from '@/users/services/users.service';
import { AwsS3Service } from '@/aws-s3/aws-s3.service';
import { AddCommentDto } from './dto/addComment.dto';
import { AddReplyDto } from './dto/addReply.dto';
import { queryParamsDto } from './dto/queryParams.dto';
import { Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ForumsService {

  constructor(
    @InjectModel(Forum.name) private forumModel: Model<ForumDocument>,
    private userService: UsersService,
    private awsS3Service: AwsS3Service,
  ){}

  async create(createForumDto: CreateForumDto, userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const forum = await this.forumModel.create({
      ...createForumDto,
      user: userId,
      likes: [],
    });

    return forum.populate([
      { path: 'user', select: 'name email' },
      { path: 'likes', select: 'name email' }
    ]);
  }

  async findAll(queryParams: queryParamsDto) {
    try {
      const { page = 1, limit = 10, keyword } = queryParams;
      const skip = (page - 1) * limit;

      const query = keyword
        ? {
            $or: [
              { content: { $regex: keyword, $options: 'i' } },
              { tags: { $regex: keyword, $options: 'i' } },
            ],
          }
        : {};

      const [forums, total] = await Promise.all([
        this.forumModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'name email')
          .populate('comments.user', 'name email')
          .populate('comments.replies.user', 'name email')
          .populate('likes', 'name email'),
        this.forumModel.countDocuments(query),
      ]);

      return {
        data: forums,
        meta: {
          total,
          page: Number(page),
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid forum ID');
    }

    const forum = await this.forumModel
      .findById(id)
      .populate('user', 'name email')
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email')
      .populate('likes', 'name email');

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    return forum;
  }

  async update(id: string, updateForumDto: UpdateForumDto, userId: string) {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid IDs provided');
    }

    const forum = await this.forumModel.findById(id);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (forum.user.toString() !== userId && user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to update this forum');
    }

    Object.assign(forum, updateForumDto);
    await forum.save();

    return forum.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.replies.user', select: 'name email' },
      { path: 'likes', select: 'name email' }
    ]);
  }

  async remove(id: string, userId: string) {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid IDs provided');
    }

    const forum = await this.forumModel.findById(id);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (forum.user.toString() !== userId && user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to delete this forum');
    }

    await forum.deleteOne();
    return { message: 'Forum deleted successfully' };
  }

  async addCommentForum(forumId: string, userId: string, addCommentDto: AddCommentDto) {
    if (!isValidObjectId(forumId) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid forum or user ID');
    }

    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const commentData = {
      _id: new Types.ObjectId(),
      user: userId,
      content: addCommentDto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: []
    };

    forum.comments.push(commentData as any);
    await forum.save();
    
    return forum.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.replies.user', select: 'name email' }
    ]);
  }

  async updateComment(forumId: string, commentId: string, userId: string, content: string) {
    if (!isValidObjectId(forumId) || !isValidObjectId(commentId) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid IDs provided');
    }

    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const comment = forum.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (comment.user.toString() !== userId && user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to update this comment');
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await forum.save();

    return forum.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.replies.user', select: 'name email' }
    ]);
  }

  async deleteComment(forumId: string, commentId: string, userId: string) {
    if (!isValidObjectId(forumId) || !isValidObjectId(commentId) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid IDs provided');
    }

    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const comment = forum.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (comment.user.toString() !== userId && user.role !== 'admin') {
      throw new ForbiddenException('Not authorized to delete this comment');
    }

    forum.comments.splice(forum.comments.indexOf(comment), 1);
    await forum.save();

    return forum.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
      { path: 'comments.replies.user', select: 'name email' }
    ]);
  }

  async addLikeForum(userId,forumId){
    if(!isValidObjectId(forumId))throw new BadRequestException('invalid mongo id')
    const forum = await this.forumModel.findById(forumId)
    if(!forum) throw new BadRequestException('forum not found')

    if(forum.likes.includes(userId)) {
      throw new BadRequestException('User has already liked this post');
    }

    await this.forumModel.findByIdAndUpdate(
      forumId,
      {
        $push: { likesArray: userId },
        $inc: { likes: 1 }
      }
    );
    
    return {message: "forum liked"}
    
  }
  async removeLikeForum(userId,forumId){
    if(!isValidObjectId(forumId))throw new BadRequestException('invalid mongo id')
    const forum = await this.forumModel.findById(forumId)
    if(!forum) throw new BadRequestException('forum not found')

    if(!forum.likes.includes(userId)) {
      throw new BadRequestException('User has not liked this post');
    }

    await this.forumModel.findByIdAndUpdate(
      forumId,
      {
        $pull: { likesArray: userId },
        $inc: { likes: -1 }
      }
    );
    
    return {message: "forum disliked"}
    
  }

  async addReplyToComment(userId: string, forumId: string, commentId: string, addReplyDto: AddReplyDto) {
    if(!isValidObjectId(forumId)) throw new BadRequestException('invalid forum id')
    if(!isValidObjectId(commentId)) throw new BadRequestException('invalid comment id')

    const forum = await this.forumModel.findOneAndUpdate(
      {
        _id: forumId,
        'comments._id': commentId
      },
      {
        $push: {
          'comments.$.replies': {
            user: userId,
            content: addReplyDto.content
          }
        }
      },
      { new: true }
    );

    if (!forum) throw new BadRequestException('forum or comment not found')
    return forum
  }

  async updateReply(userId: string, forumId: string, commentId: string, replyId: string, content: string) {
    if(!isValidObjectId(forumId)) throw new BadRequestException('invalid forum id')
    if(!isValidObjectId(commentId)) throw new BadRequestException('invalid comment id')
    if(!isValidObjectId(replyId)) throw new BadRequestException('invalid reply id')

    const forum = await this.forumModel.findOne({
      _id: forumId,
      'comments._id': commentId,
      'comments.replies._id': replyId
    });

    if (!forum) throw new BadRequestException('forum, comment or reply not found')

    const comment = forum.comments.find(c => c._id.toString() === commentId);
    if (!comment) throw new BadRequestException('comment not found')

    const reply = comment.replies.find(r => r._id.toString() === replyId);
    if (!reply) throw new BadRequestException('reply not found')

    if (reply.user.toString() !== userId) {
      throw new BadRequestException('unauthorized to edit this reply')
    }

    const updatedForum = await this.forumModel.findOneAndUpdate(
      {
        _id: forumId,
        'comments._id': commentId,
        'comments.replies._id': replyId
      },
      {
        $set: {
          'comments.$[comment].replies.$[reply].content': content
        }
      },
      {
        arrayFilters: [
          { 'comment._id': commentId },
          { 'reply._id': replyId }
        ],
        new: true
      }
    );

    return updatedForum;
  }

  async deleteReply(userId: string, forumId: string, commentId: string, replyId: string) {
    if(!isValidObjectId(forumId)) throw new BadRequestException('invalid forum id')
    if(!isValidObjectId(commentId)) throw new BadRequestException('invalid comment id')
    if(!isValidObjectId(replyId)) throw new BadRequestException('invalid reply id')

    const forum = await this.forumModel.findOne({
      _id: forumId,
      'comments._id': commentId
    });

    if (!forum) throw new BadRequestException('forum or comment not found')

    const comment = forum.comments.find(c => c._id.toString() === commentId);
    if (!comment) throw new BadRequestException('comment not found')

    const reply = comment.replies.find(r => r._id.toString() === replyId);
    if (!reply) throw new BadRequestException('reply not found')

    if (reply.user.toString() !== userId) {
      throw new BadRequestException('unauthorized to delete this reply')
    }

    const updatedForum = await this.forumModel.findOneAndUpdate(
      { _id: forumId, 'comments._id': commentId },
      {
        $pull: {
          'comments.$.replies': { _id: replyId }
        }
      },
      { new: true }
    );

    return updatedForum;
  }

  async likeForum(forumId: string, userId: string) {
    if (!isValidObjectId(forumId) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid forum or user ID');
    }

    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const likeExists = forum.likes.includes(userId as any);

    if (likeExists) {
      await this.forumModel.findByIdAndUpdate(
        forumId,
        { $pull: { likes: userId } }
      );
    } else {
      await this.forumModel.findByIdAndUpdate(
        forumId,
        { $push: { likes: userId } }
      );
    }

    const updatedForum = await this.forumModel
      .findById(forumId)
      .populate('user', 'name email')
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email')
      .populate('likes', 'name email');

    return updatedForum;
  }

  async getLikes(forumId: string) {
    if (!isValidObjectId(forumId)) {
      throw new BadRequestException('Invalid forum ID');
    }

    const forum = await this.forumModel
      .findById(forumId)
      .populate('likes', 'name email');
      
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    return forum.likes;
  }
}
