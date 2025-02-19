import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export class queryParamsDto {
  @ApiProperty({
    required: false,
    description: 'Page number',
    default: 1
  })
  @Transform(({value}) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;
  
  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    default: 10
  })
  @Transform(({value}) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiProperty({
    required: false,
    description: 'Search keyword'
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}