import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Space } from '../space/space.entity';
import { SpaceRole } from '../spaceRole/spaceRole.entity';

@Entity()
export class UserSpace {
  @PrimaryGeneratedColumn()
  id: number; // 관계 ID

  @ManyToOne(() => User, (user) => user.userSpaces)
  user: User; // 사용자

  @ManyToOne(() => Space, (space) => space.userSpaces)
  space: Space; // 공간

  @ManyToOne(() => SpaceRole)
  role: SpaceRole; // 공간 내 역할
}
