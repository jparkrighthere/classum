import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JoinSpaceDto {
  @IsNumber()
  @IsNotEmpty()
  space_id: number;

  @IsString()
  @IsNotEmpty()
  accessCode: string;
}
