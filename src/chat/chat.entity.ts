import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('adjacency-list')
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  content: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne(() => User, (user) => user.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: User;

  @ManyToOne(() => Post, (post) => post.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;

  @DeleteDateColumn()
  deletedAt?: Date;

  @TreeParent()
  parent: Chat;

  @TreeChildren({ cascade: true })
  children: Chat[];
}
