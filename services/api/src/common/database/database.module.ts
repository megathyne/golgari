import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { Profile } from "./entities/profile.entity";
import { LOCAL_TYPE } from "../constants";
import { Url } from "./entities/url.entity";
import { Chat } from "./entities/chat.entity";
import { Friendship } from "./entities/friendship.entity";

const config = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  logging: false,
  entities: [Chat, Friendship, Profile, Url, Users],
  synchronize: true,
  ssl: process.env.ENV === LOCAL_TYPE ? false : true,
  extra: process.env.ENV === LOCAL_TYPE ? {} : { ssl: { rejectUnauthorized: false } },
};

@Module({
  imports: [TypeOrmModule.forRoot(config as TypeOrmModuleOptions)],
})
export class DatabaseModule {}
