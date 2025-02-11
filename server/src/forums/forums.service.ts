import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Forum } from './schema/forum.schema';
import { Model } from 'mongoose';
import { UsersService } from '@/users/services/users.service';

@Injectable()
export class ForumsService {

  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    private userService: UsersService,
  ){}

  async create(createForumDto: CreateForumDto, userId) {
    try{
      const user = await this.userService.findById(userId)
      if(!Object.keys(user).length) throw new BadRequestException('user not found')
      if('_id' in user){
        const forum = await this.forumModel.create({...createForumDto, user: user._id})
        return forum
      }

    }catch(error){
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
    }
  }

  findAll() {
    return `This action returns all forums`;
  }

  findOne(id: number) {
    return `This action returns a #${id} forum`;
  }

  update(id: number, updateForumDto: UpdateForumDto) {
    return `This action updates a #${id} forum`;
  }

  remove(id: number) {
    return `This action removes a #${id} forum`;
  }
}
