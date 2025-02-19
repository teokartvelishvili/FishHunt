import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddReplyDto {
  @ApiProperty({
    example: 'reply to comment content'
  })
  @IsString()
  @IsNotEmpty()
  content: string
} 