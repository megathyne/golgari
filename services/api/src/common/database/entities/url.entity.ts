import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Url extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.urls)
  user: User;

  @Column({ name: "orig_url", nullable: false })
  origUrl: string;

  @Column({ name: "short_url", nullable: false })
  shortUrl: string;

  @Column({ default: 0 })
  clicks: number;

  @Column({ name: "expires_at", nullable: false })
  expiresAt: Date;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
