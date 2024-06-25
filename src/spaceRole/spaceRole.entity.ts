import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from './enum/spaceRole.enum';
import { Space } from '../space/space.entity';
import { UserSpace } from 'src/userSpace/userSpace.entity';

@Entity()
export class SpaceRole {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @ManyToOne(() => Space, (space) => space.spaceRoles, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  space: Space;

  @ManyToOne(() => UserSpace, (userSpace) => userSpace.spaceRole, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  userSpaces: UserSpace;

  @DeleteDateColumn()
  deletedAt?: Date;
}
