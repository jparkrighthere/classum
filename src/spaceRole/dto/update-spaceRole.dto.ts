// import { Role } from '../enum/spaceRole.enum';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateSpaceRoleDto } from './create-spaceRole.dto';
import { Type } from 'class-transformer';

export class UpdateSpaceRoleDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreateSpaceRoleDto)
  spaceRole: CreateSpaceRoleDto;

  @IsNumber()
  @IsNotEmpty()
  space_id: number;
}
