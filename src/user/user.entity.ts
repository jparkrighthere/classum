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

  @Column({ default: null })
  profile: string;

  @OneToMany(() => UserSpace, (userSpace) => userSpace.user, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  userSpaces: UserSpace[];

  @OneToMany(() => Post, (post) => post.author, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany(() => Post, (post) => post.author, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  chats: Post[];
}
