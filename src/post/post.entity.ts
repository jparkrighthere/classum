import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType } from './enum/post.enum';
import { Space } from 'src/space/space.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  title: string;

  @Column()
  isAnonymous: boolean;

  @Column({
    type: 'enum',
    enum: PostType,
  })
  type: PostType;

  @Column()
  content: string;

  @Column()
  attachment: string;

  @ManyToOne(() => Space, (space) => space.posts, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  space: Space;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: User;

  //   @OneToMany(() => Comment, (comment) => comment.post, {
  //     eager: true,
  //     onDelete: 'CASCADE',
  //   })
  //   chats: Chat[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
