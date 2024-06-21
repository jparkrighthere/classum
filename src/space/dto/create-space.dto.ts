import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateSpaceRoleDto } from 'src/spaceRole/dto/create-spaceRole.dto';

export class CreatespaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => CreateSpaceRoleDto)
  @ValidateNested({ each: true })
  spaceRoles: CreateSpaceRoleDto[];

  @ValidateNested()
  @Type(() => CreateSpaceRoleDto)
  @IsNotEmpty()
  selectedSpaceRole: CreateSpaceRoleDto;
}
