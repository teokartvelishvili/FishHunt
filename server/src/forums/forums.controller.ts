import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { HasValidUserId } from '@/guards/hasValidUserId.guard';
import { UserId } from '@/decorators/userId.decorator';
import { queryParamsDto } from './dto/queryParams.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddCommentDto } from './dto/addComment.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

// @UseGuards(AuthGuard)
@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  @ApiHeader({
    name: 'user-id',
    required: true
  })
  @ApiCreatedResponse({
    example: `{
    "content": "content test",
    "user": "67a8ee2f01b7e7462deb2a81",
    "tags": [
        "Fishing"
    ],
    "likes": 0,
    "likesArray": [],
    "imagePath": "images/1739880054710",
    "_id": "67b47677840f828f0652d383",
    "comments": [],
    "createdAt": "2025-02-18T12:00:55.468Z",
    "updatedAt": "2025-02-18T12:00:55.468Z",
    "__v": 0
    }`
  })
  @ApiResponse({status: 400,description: "user id not provided"})
  @ApiBadRequestResponse({
    example:{
      message: `"content must be a string",
        "content should not be empty",
        "All tags's elements must be unique",
        "tags should not be empty",
        "tags must be an array"`,
      error: 'Bad request'
    }
  })
  @UseGuards(HasValidUserId)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile()  file: Express.Multer.File, @UserId() userId,@Body() createForumDto: CreateForumDto) {
    if (!file) return this.forumsService.create(createForumDto, userId);

    const timestamp = Date.now();
    const path = timestamp;
    const filePath = `images/${path}`
    const filesSizeInMb = Number((file.size/(1024 * 1024)).toFixed(1))
    
    if(filesSizeInMb > 5){
      throw new BadRequestException('The file must be less than 5 MB.')
    }
    return this.forumsService.create(createForumDto, userId, filePath, file.buffer);
  }

  @ApiResponse({
    status: 200,
    description: 'A list of forums with pagination'
  })
  @Get()
  findAll(@Query() queryParams: queryParamsDto ) {
    return this.forumsService.findAll(queryParams);
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

  @Delete('')
  deleteForum(@Req() req: Request) {
    const forumId = req.headers['forum-id'] as string
    if(!forumId) throw new BadRequestException('forum id id is required')

    return this.forumsService.remove(forumId);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumsService.update(+id, updateForumDto);
  }

}
