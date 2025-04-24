import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./profile.entity";
import { Exclude } from "class-transformer";

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

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
