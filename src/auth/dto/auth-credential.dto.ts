import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
