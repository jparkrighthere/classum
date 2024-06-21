import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SpaceRole } from '../spaceRole/spaceRole.entity';
import { UserSpace } from 'src/user/userSpace.entity';

@Entity()
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space, { cascade: true })
  spaceRoles: SpaceRole[]; // 공간 내의 역할들

  @OneToMany(() => UserSpace, (userSpace) => userSpace.space)
  userSpaces: UserSpace[]; // 사용자-공간 관계

  @Column({ length: 8 })
  userAccessCode: string; // 사용자 접근 코드

  @Column({ length: 8 })
  adminAccessCode: string; // 관리자 접근 코드
}
