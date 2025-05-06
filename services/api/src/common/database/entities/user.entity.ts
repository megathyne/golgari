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
import { Friends as Friends } from "./friend.entity";
import { Url } from "./url.entity";

@Entity()
export class User extends BaseEntity {
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

  @OneToMany(() => Url, (url) => url.user, { eager: true })
  urls: Url[];

  @OneToMany(() => Chat, (chat) => chat.user, { eager: true })
  chat: Chat[];

  @OneToMany(() => Friends, (friendship) => friendship.requestor, { eager: true })
  sentFriendRequests: Friends[];

  @OneToMany(() => Friends, (friendship) => friendship.recipient, { eager: true })
  receivedFriendRequests: Friends[];

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
