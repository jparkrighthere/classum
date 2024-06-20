import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  profile: string;

  // NO EMAIL FIELD
  @IsEmpty()
  email: string;
}
