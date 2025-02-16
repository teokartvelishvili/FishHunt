import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsPhoneNumber, 
  MinLength, 
  MaxLength, 
  IsOptional 
} from 'class-validator';
import { Role } from '../../types/role.enum';

export class SellerRegisterDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsOptional() // მაღაზიის ლოგო სავალდებულო არ არის
  @IsString()
  storeLogo?: string;

  @IsNotEmpty()
  @IsString()
  ownerFirstName: string;

  @IsNotEmpty()
  @IsString()
  ownerLastName: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(20, { message: 'Password is too long.' })
  password: string; 

  @IsNotEmpty()
  @IsString()
  identificationNumber: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  role: Role = Role.Seller;
}
