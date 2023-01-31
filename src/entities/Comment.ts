import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Post } from './Post'
import { User } from './User'

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field(() => ID)
  user_id: number;

  @Column()
  @Field()
  post_id: number;

  @Column()
  @Field()
  text: string;

  @Column()
  @Field()
  created_at: Date;

  @Column()
  @Field()
  created_by: string;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User

  @ManyToOne(() => Post, (Post) => Post.comments, { nullable: true })
  @Field(() => User, { nullable: true })
  post: Post

}


@InputType()
export class CommentInput {
  @Field({ nullable: true })
  comment: string;

  @Field({ nullable: true })
  created_at: Date;
}