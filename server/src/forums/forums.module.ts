import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from './schemas/forum.schema';
import { UsersModule } from '../users/users.module';
import { AwsS3Module } from '@/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Forum.name, schema: ForumSchema}]),
    UsersModule,
    AwsS3Module
  ], 

  controllers: [ForumsController],
  providers: [ForumsService],
})
export class ForumsModule {}
