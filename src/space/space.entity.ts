import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { SpaceRole } from '../spaceRole/spaceRole.entity';
import { UserSpace } from '../userSpace/userSpace.entity';
import { Post } from 'src/post/post.entity';

@Entity()
export class Space {
  @PrimaryGeneratedColumn()
  space_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  spaceRoles: SpaceRole[];

  @OneToMany(() => UserSpace, (userSpace) => userSpace.space, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  userSpaces: UserSpace[];

  @Column({ length: 8 })
  userAccessCode: string;

  @Column({ length: 8 })
  adminAccessCode: string;

  @OneToMany(() => Post, (post) => post.space, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
