import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null, nullable: true })
  last_name: string;

  @Column({ default: null, nullable: true })
  first_name: string;

  @Column({ default: null, nullable: true })
  profile: string;

  @Column({ default: true })
  isActive: boolean;
}
