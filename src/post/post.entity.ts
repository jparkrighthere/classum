import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType } from './enum/post.enum';
import { Space } from 'src/space/space.entity';
import { Chat } from 'src/chat/chat.entity';

@Entity()
export class Post {
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

  @Column({ default: null })
  attachment: string;

  @ManyToOne(() => Space, (space) => space.posts, {
    // lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  space: Space;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: User;

  @OneToMany(() => Chat, (chat) => chat.post, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  chats: Chat[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
