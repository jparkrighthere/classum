import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserSpace } from '../userSpace/userSpace.entity';
import { Post } from 'src/post/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  last_name: string;

  @Column()
  first_name: string;

  @Column()
  profile: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserSpace, (userSpace) => userSpace.user)
  userSpaces: UserSpace[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
