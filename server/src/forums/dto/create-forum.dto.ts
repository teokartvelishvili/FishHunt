import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateForumDto {

  @IsNotEmpty()
  @IsString()
  content: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tags: string[]
  

}
