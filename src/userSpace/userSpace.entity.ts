import {
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Space } from '../space/space.entity';
import { SpaceRole } from '../spaceRole/spaceRole.entity';

@Entity()
export class UserSpace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userSpaces)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Space, (space) => space.userSpaces)
  @JoinColumn()
  space: Space;

  @ManyToOne(() => SpaceRole, (spaceRole) => spaceRole.userSpaces)
  @JoinColumn()
  spaceRole: SpaceRole;

  @DeleteDateColumn()
  deletedAt?: Date;
}

// UserSpace는 User와 Space 간의 관계를 나타내며,
// 유저가 특정 공간에서 어떤 역할을 하는지를 추가적으로 저장하는 엔티티
