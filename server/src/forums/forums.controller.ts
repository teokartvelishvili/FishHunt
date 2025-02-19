import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, BadRequestException, Headers, Put, NotFoundException } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { HasValidUserId } from '@/guards/hasValidUserId.guard';
import { UserId } from '@/decorators/userId.decorator';
import { queryParamsDto } from './dto/queryParams.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddCommentDto } from './dto/addComment.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AddReplyDto } from './dto/addReply.dto';
import { RolesGuard } from '@/guards/roles.guard';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/types/role.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserDocument } from '@/users/schemas/user.schema';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


// @UseGuards(AuthGuard)
@Controller('forums')
@ApiTags('Forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all forums' })
  @ApiResponse({ status: 200, description: 'Return all forums.' })
  findAll(@Query() queryParams: queryParamsDto) {
    return this.forumsService.findAll(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get forum by id' })
  @ApiResponse({ status: 200, description: 'Return forum by id.' })
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create forum' })
  @ApiResponse({ status: 201, description: 'Forum successfully created.' })
  create(
    @Body() createForumDto: CreateForumDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.create(createForumDto, user._id.toString());
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update forum' })
  @ApiResponse({ status: 200, description: 'Forum successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() updateForumDto: UpdateForumDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.update(id, updateForumDto, user._id.toString());
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete forum' })
  @ApiResponse({ status: 200, description: 'Forum successfully deleted.' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.remove(id, user._id.toString());
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add comment to forum' })
  @ApiResponse({ status: 201, description: 'Comment successfully added.' })
  addComment(
    @Param('id') id: string,
    @Body() addCommentDto: AddCommentDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.addCommentForum(id, user._id.toString(), addCommentDto);
  }

  @Delete(':forumId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete comment' })
  deleteComment(
    @Param('forumId') forumId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.deleteComment(forumId, commentId, user._id.toString());
  }

  @Patch(':forumId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update comment' })
  updateComment(
    @Param('forumId') forumId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: AddCommentDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.updateComment(
      forumId,
      commentId,
      user._id.toString(),
      updateCommentDto.content
    );
  }

  @Post('add-comment')
  @ApiHeader({
    name: 'user-id',
    required: true
  })
  @ApiHeader({
    name: 'forum-id',
    required: true
  })
  @ApiCreatedResponse({
    example: `{
    "_id": "67b47677840f828f0652d383",
    "content": "content test",
    "user": "67a8ee2f01b7e7462deb2a81",
    "tags": [
        "Fishing"
    ],
    "likes": 0,
    "likesArray": [],
    "imagePath": "images/1739880054710",
    "comments": [
        {
            "user": "67a8ee2f01b7e7462deb2a81",
            "content": "forumis comment",
            "_id": "67b4768f840f828f0652d386",
            "createdAt": "2025-02-18T12:01:19.396Z",
            "updatedAt": "2025-02-18T12:01:19.396Z"
        }
    ],
    "createdAt": "2025-02-18T12:00:55.468Z",
    "updatedAt": "2025-02-18T12:01:19.396Z",
    "__v": 0
    }`
  })
  @ApiBadRequestResponse({
    example: {
      message: "content required",
      error: 'bad request',
      status: 400
    }
  })
  @UseGuards(HasValidUserId)
  addCommentForum(
    @UserId() userId,
    @Body() addCommentDto: AddCommentDto,
    @Req() req: Request
  ){
    const forumId = req.headers['forum-id'] as string;
    if(!forumId)throw new BadRequestException('forum id is required')
    return this.forumsService.addCommentForum(userId,forumId, addCommentDto)
  }

  @Post('add-like')
  @ApiOkResponse({
    example: {
      message: "forum liked"
    }
  })
  @ApiBadRequestResponse({
    example: {
      message: "User have already liked this post",
      statusCode: 401
    }
  })
  @ApiNotFoundResponse({
    example: {
      message: "forum not found",
      statusCode: 400
    }
  })
  @UseGuards(HasValidUserId)
  addLikeForum(
    @UserId() userId,
    @Req() req: Request
  ){
    const forumId = req.headers['forum-id'] as string;
    if(!forumId)throw new BadRequestException('forum id is required')
    return this.forumsService.addLikeForum(userId, forumId)
  }
  
  
  @Post('remove-like')
  @ApiOkResponse({
    example: {
      message: "forum disliked"
    }
  })
  @ApiNotFoundResponse({
    example: {
      message: "forum not found",
      statusCode: 400
    }
  })
  @ApiBadRequestResponse({
    example: {
      message: "User has not liked this post",
      statusCode: 400,
      error: "Bad Request"
    }
  })
  @UseGuards(HasValidUserId)
  removeLikeForum(
    @UserId() userId,
    @Req() req: Request
  ){
    const forumId = req.headers['forum-id'] as string
    if(!forumId)throw new BadRequestException('forum id is required')
    return this.forumsService.removeLikeForum(userId, forumId)
  }

  @Post('comments/:commentId/reply')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add reply to comment' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'Comment ID'
  })
  addReplyToComment(
    @UserId() userId: string,
    @Param('commentId') commentId: string,
    @Body() addReplyDto: AddReplyDto,
    @Headers('forum-id') forumId: string,
  ) {
    return this.forumsService.addReplyToComment(userId, forumId, commentId, addReplyDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch('comments/:commentId/replies/:replyId')
  @ApiOperation({ summary: 'Update reply' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'Comment ID'
  })
  @ApiParam({
    name: 'replyId',
    required: true,
    description: 'Reply ID'
  })
  updateReply(
    @UserId() userId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: AddReplyDto,
    @Headers('forum-id') forumId: string,
  ) {
    return this.forumsService.updateReply(userId, forumId, commentId, replyId, updateReplyDto.content);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('comments/:commentId/replies/:replyId')
  @ApiOperation({ summary: 'Delete reply' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'Comment ID'
  })
  @ApiParam({
    name: 'replyId',
    required: true,
    description: 'Reply ID'
  })
  deleteReply(
    @UserId() userId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Headers('forum-id') forumId: string,
  ) {
    return this.forumsService.deleteReply(userId, forumId, commentId, replyId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Like/unlike forum' })
  @ApiResponse({ status: 200, description: 'Forum liked/unliked successfully.' })
  likeForum(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.forumsService.likeForum(id, user._id.toString());
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get forum likes' })
  @ApiResponse({ status: 200, description: 'Return forum likes.' })
  getLikes(@Param('id') id: string) {
    return this.forumsService.getLikes(id);
  }

  @Get(':forumId/comments')
  @ApiOperation({ summary: 'Get forum comments' })
  @ApiResponse({ status: 200, description: 'Return forum comments.' })
  async getComments(@Param('forumId') forumId: string) {
    const forum = await this.forumsService.findOne(forumId);
    return forum.comments;
  }

  @Get(':forumId/comments/:commentId/replies')
  @ApiOperation({ summary: 'Get comment replies' })
  @ApiResponse({ status: 200, description: 'Return comment replies.' })
  async getReplies(
    @Param('forumId') forumId: string,
    @Param('commentId') commentId: string
  ) {
    const forum = await this.forumsService.findOne(forumId);
    const comment = forum.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment.replies;
  }
}
