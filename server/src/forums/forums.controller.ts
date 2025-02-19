import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { queryParamsDto } from './dto/queryParams.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddCommentDto } from './dto/addComment.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { User } from '@/types';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() createForumDto: CreateForumDto,
  ) {
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!file) return this.forumsService.create(createForumDto, user._id);

    const timestamp = Date.now();
    const filePath = `images/${timestamp}`;
    const filesSizeInMb = Number((file.size / (1024 * 1024)).toFixed(1));

    if (filesSizeInMb > 5) {
      throw new BadRequestException('The file must be less than 5 MB.');
    }

    return this.forumsService.create(
      createForumDto,
      user._id,
      filePath,
      file.buffer,
    );
  }

  @Get()
  findAll(@Query() queryParams: queryParamsDto) {
    return this.forumsService.findAll(queryParams);
  }

  @Post('add-comment')
  @UseGuards(JwtAuthGuard)
  addCommentForum(
    @CurrentUser() user: User,
    @Body() addCommentDto: AddCommentDto,
    @Req() req: Request,
  ) {
    return;
    // const forumId = req.headers['forum-id'] as string;
    // if (!forumId) throw new BadRequestException('Forum ID is required');
    // return this.forumsService.addCommentForum(user._id, forumId, addCommentDto);
  }

  @Post('add-like')
  @UseGuards(JwtAuthGuard)
  addLikeForum(@CurrentUser() user: User, @Req() req: Request) {
    // const forumId = req.headers['forum-id'] as string;
    // if (!forumId) throw new BadRequestException('Forum ID is required');
    // return this.forumsService.addLikeForum(user._id, forumId);
  }

  @Post('remove-like')
  @UseGuards(JwtAuthGuard)
  removeLikeForum(@CurrentUser() user: User, @Req() req: Request) {
    const forumId = req.headers['forum-id'] as string;
    if (!forumId) throw new BadRequestException('Forum ID is required');
    return this.forumsService.removeLikeForum(user._id, forumId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.forumsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateForumDto: UpdateForumDto,
  ) {
    return this.forumsService.update(id, updateForumDto, user._id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.forumsService.remove(id, user._id);
  }
}
