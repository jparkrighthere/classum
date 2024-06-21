import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './enum/spaceRole.enum';
import { Space } from '../space/space.entity';

@Entity()
export class SpaceRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @ManyToOne(() => Space, (space) => space.spaceRoles)
  space: Space;
}
