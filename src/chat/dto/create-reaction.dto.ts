import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @IsNumber()
  @IsNotEmpty()
  space_id: number;

  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;
}
