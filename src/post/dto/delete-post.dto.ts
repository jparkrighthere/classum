import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePostDto {
  @IsNumber()
  @IsNotEmpty()
  space_id: number;

  @IsNumber()
  @IsNotEmpty()
  post_id: number;
}
