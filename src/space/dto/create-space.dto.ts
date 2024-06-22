import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSpaceRoleDto } from 'src/spaceRole/dto/create-spaceRole.dto';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  spaceRoles: CreateSpaceRoleDto[]; // 공간 내의 역할들

  @ValidateNested()
  @Type(() => CreateSpaceRoleDto)
  @IsNotEmpty()
  ownerSpaceRole: CreateSpaceRoleDto; // 관리자 역할
}
