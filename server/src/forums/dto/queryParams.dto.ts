import { Transform } from "class-transformer"
import { IsNumber, IsOptional, Min } from "class-validator"


export class queryParamsDto {
  @Transform(({value})=> Number(value))
  @IsOptional()
  @IsNumber()
  page: number = 1
  
  @Transform(({value})=> Number(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  take: number = 5
}