import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostType } from '../enum/post.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  attachment: string;

  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @IsNumber()
  @IsNotEmpty()
  space_id: number;
}
