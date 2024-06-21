import { Role } from '../enum/spaceRole.enum';
import { IsEnum, IsString } from 'class-validator';

export class CreateSpaceRoleDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}
