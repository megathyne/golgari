import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./profile.entity";
import { Exclude } from "class-transformer";
import { Chat } from "./chat.entity";
import { Friendship } from "./friendship.entity";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @OneToOne(() => Profile, { eager: true })
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

  @OneToMany(() => Chat, (chat) => chat.user, { eager: true })
  chat: Chat[];

  @OneToMany(() => Friendship, (friendship) => friendship.requestor, { eager: true })
  sentFriendRequests: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.recipient, { eager: true })
  receivedFriendRequests: Friendship[];

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
