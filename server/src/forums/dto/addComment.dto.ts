import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsString } from "class-validator";

export class AddCommentDto {

  @IsString()
  @IsNotEmpty()
  content: string

}
