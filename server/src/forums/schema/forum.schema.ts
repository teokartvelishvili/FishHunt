import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: true})
export class Comment{
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: mongoose.Schema.Types.ObjectId

  @Prop({ type: String})
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({timestamps: true})
export class Forum {

  @Prop({type: String})
  content: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'user'})
  user: mongoose.Schema.Types.ObjectId

  @Prop({
    type: [String],
    enum: {
      values: ['Fishing', 'Camping', 'Hunting'],
      message: 'Tags must be one of: Fishing, Camping, Hunting',
    },
    required: true,
  })
  tags: string[];  
  

  @Prop({type: [CommentSchema], default: []})
  comments: Comment[]

  @Prop({type: Number, default: 0})
  likes: number

  @Prop({type: [mongoose.Schema.Types.ObjectId], default: []})
  likesArray: mongoose.Schema.Types.ObjectId[]

  @Prop({type: String})
  imagePath: string

}

export const FourmSchema = SchemaFactory.createForClass(Forum)