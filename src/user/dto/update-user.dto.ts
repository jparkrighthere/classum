import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profile: string;

  // NO EMAIL FIELD
  email: string;
}
