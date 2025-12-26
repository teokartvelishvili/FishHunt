import { IsString, Matches } from 'class-validator';

export class SaveShippingDetailsDto {
  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  country!: string;

  @IsString()
  @Matches(/^[+]?[0-9\s\-()]{9,20}$/, {
    message: 'Please enter a valid phone number',
  })
  phone!: string;
}
