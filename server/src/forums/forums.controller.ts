import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { HasValidUserId } from '@/guards/hasValidUserId.guard';
import { UserId } from '@/decorators/userId.decorator';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  @UseGuards(HasValidUserId)
  create(@UserId() userId,@Body() createForumDto: CreateForumDto) {
    return this.forumsService.create(createForumDto, userId);
  }

  @Get()
  findAll() {
    return this.forumsService.findAll();
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
