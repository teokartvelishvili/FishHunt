import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { HasValidUserId } from '@/guards/hasValidUserId.guard';
import { UserId } from '@/decorators/userId.decorator';
import { queryParamsDto } from './dto/queryParams.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddCommentDto } from './dto/addComment.dto';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
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

  @Get()
  findAll(@Query() queryParams: queryParamsDto ) {
    return this.forumsService.findAll(queryParams);
  }

  @Post('add-comment')
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
  @UseGuards(HasValidUserId)
  addLikeForum(
    @UserId() userId,
    @Req() req: Request
  ){
    const forumId = req.headers['forum-id'] as string;
    if(!forumId)throw new BadRequestException('forum id is required')
    return this.forumsService.addLikeForum(userId, forumId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumsService.update(+id, updateForumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumsService.remove(+id);
  }
}
