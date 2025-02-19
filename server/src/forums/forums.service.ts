import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Forum } from './schema/forum.schema';
import { isValidObjectId, Model } from 'mongoose';
import { UsersService } from '@/users/services/users.service';
import { queryParamsDto } from './dto/queryParams.dto';
import { AwsS3Service } from '@/aws-s3/aws-s3.service';
import { AddCommentDto } from './dto/addComment.dto';

@Injectable()
export class ForumsService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    private userService: UsersService,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(createForumDto: CreateForumDto, userId, filePath?, file?) {
    try {
      const user = await this.userService.findById(userId);
      if (!Object.keys(user).length)
        throw new BadRequestException('user not found');
      if ('_id' in user) {
        if (!filePath && !file) {
          const forum = await this.forumModel.create({
            ...createForumDto,
            user: user._id,
          });
          return forum;
        }
        const imagePath = await this.awsS3Service.uploadImage(filePath, file);
        const forum = await this.forumModel.create({
          ...createForumDto,
          user: user._id,
          imagePath,
        });
        return forum;
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findAll(queryParams: queryParamsDto) {
    const { page, take } = queryParams;
    const limit = Math.min(take, 20);

    const forumData = await this.forumModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'comments',
        select: '-_id -updatedAt',
        populate: {
          path: 'user',
          select: 'name -_id',
        },
      });

    const forumDataWithImages = await Promise.all(
      forumData.map(async (forum) => {
        const imageUrl = await this.awsS3Service.getImageByFileId(
          forum.imagePath,
        );
        return {
          ...forum.toObject(),
          image: imageUrl,
        };
      }),
    );
    return forumDataWithImages;
  }

  async addCommentForum(userId, forumId, addCommentDto: AddCommentDto) {
    if (!isValidObjectId(forumId))
      throw new BadRequestException('invalid mongo id');
    const forum = await this.forumModel.findById(forumId);
    if (!forum) throw new BadRequestException('forum not found');
    const updatedForum = await this.forumModel.findByIdAndUpdate(
      forumId,
      {
        $push: {
          comments: {
            user: userId,
            content: addCommentDto.content,
          },
        },
      },
      { new: true },
    );
    return updatedForum;
  }

  async addLikeForum(userId, forumId) {
    if (!isValidObjectId(forumId))
      throw new BadRequestException('invalid mongo id');
    const forum = await this.forumModel.findById(forumId);
    if (!forum) throw new BadRequestException('forum not found');

    if (forum.likesArray.includes(userId)) {
      throw new BadRequestException('User has already liked this post');
    }

    await this.forumModel.findByIdAndUpdate(forumId, {
      $push: { likesArray: userId },
      $inc: { likes: 1 },
    });

    return { message: 'forum liked' };
  }
  async removeLikeForum(userId, forumId) {
    if (!isValidObjectId(forumId))
      throw new BadRequestException('invalid mongo id');
    const forum = await this.forumModel.findById(forumId);
    if (!forum) throw new BadRequestException('forum not found');

    if (!forum.likesArray.includes(userId)) {
      throw new BadRequestException('User has not liked this post');
    }

    await this.forumModel.findByIdAndUpdate(forumId, {
      $pull: { likesArray: userId },
      $inc: { likes: -1 },
    });

    return { message: 'forum disliked' };
  }

  findOne(id: string) {
    return `This action returns a #${id} forum`;
  }

  update(id: string, updateForumDto: UpdateForumDto, userId: string) {
    return `This action updates a #${id} forum`;
  }

  async remove(forumId, userId) {
    const deletedForum = await this.forumModel.findByIdAndDelete(forumId);
    if (!deletedForum) throw new BadRequestException('forum not found');
    const fileId = deletedForum.imagePath;
    return await this.awsS3Service.deleteImageByFileId(fileId);
  }
}
