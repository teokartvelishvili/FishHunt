import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, FourmSchema } from './schema/forum.schema';
import { UsersService } from '@/users/services/users.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Forum.name, schema: FourmSchema}]),
    UsersModule,
  ], 

  controllers: [ForumsController],
  providers: [ForumsService],
})
export class ForumsModule {}
