import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SellerRegisterDto {
  @ApiProperty({
    example: 'ციფრული სამყარო',
    description: 'მაღაზიის სახელი',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @ApiProperty({
    example: 'my-store',
    description: 'მაღაზიის უნიკალური საიტის სახელი (URL slug)',
    required: false,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsString()
  storeSlug?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'მაღაზიის ლოგოს ფაილი',
    required: false,
  })
  @IsOptional()
  logoFile?: Express.Multer.File;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'მაღაზიის ლოგოს URL მისამართი',
    required: false,
  })
  @IsOptional()
  @IsString()
  storeLogo?: string;

  @ApiProperty({
    example: 'გიორგი',
    description: 'მფლობელის სახელი',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  ownerFirstName: string;

  @ApiProperty({
    example: 'გიორგაძე',
    description: 'მფლობელის გვარი',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  ownerLastName: string;

  @ApiProperty({
    example: '+995555123456',
    description: 'ტელეფონის ნომერი საერთაშორისო ფორმატში',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'example@mail.com',
    description: 'ელ-ფოსტის მისამართი',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'პაროლი (მინიმუმ 6 და მაქსიმუმ 20 სიმბოლო)',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს' })
  @MaxLength(20, { message: 'პაროლი არ უნდა აღემატებოდეს 20 სიმბოლოს' })
  password: string;

  @ApiProperty({
    example: '01024085800',
    description: 'პირადი ნომერი',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  identificationNumber: string;

  @ApiProperty({
    example: 'GE29TB7777777777777777',
    description: 'საბანკო ანგარიშის ნომერი IBAN ფორმატში',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({
    example: 'თბილისი, რუსთაველის გამზირი 1',
    description: 'მაღაზიის მისამართი',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'მაღაზიის მისამართი სავალდებულოა' })
  @IsString()
  storeAddress: string;

  @ApiProperty({
    example: { lat: 41.7151, lng: 44.8271 },
    description: 'მაღაზიის მდებარეობის კოორდინატები',
    required: false,
  })
  @IsOptional()
  storeLocation?: {
    lat: number;
    lng: number;
  };
}
