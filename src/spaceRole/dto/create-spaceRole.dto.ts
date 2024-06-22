import { Role } from '../enum/spaceRole.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSpaceRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
