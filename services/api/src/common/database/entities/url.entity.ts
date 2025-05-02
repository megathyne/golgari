import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Url extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
