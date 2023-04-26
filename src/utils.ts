import "reflect-metadata";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Blog } from "./entities/Blog";
import { Comment } from "./entities/Comment";
import { DataSource } from "typeorm";
import { Picture } from "./entities/Picture";


console.log('POSTGRES HOST', process.env.POSTGRES_HOST)

const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: [User, Post, Blog, Comment, Picture],
  logging: ["query", "error"],
});

export default datasource;
