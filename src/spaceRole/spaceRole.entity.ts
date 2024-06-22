import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
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
    default: Role.USER, // ?
  })
  role: Role;

  @ManyToOne(() => Space, (space) => space.spaceRoles)
  @JoinColumn()
  space: Space;

  @OneToMany(() => UserSpace, (userSpace) => userSpace.spaceRole, {
    lazy: true,
  })
  userSpaces: UserSpace[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
