import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";

// const today = new Date();

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  text: string;

  @Column()
  @Field(() => Date)
  created_at: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  @Field(() => Post)
  post: Post;
}

@InputType()
export class CommentInput {
  @Field()
  text: string;
}
