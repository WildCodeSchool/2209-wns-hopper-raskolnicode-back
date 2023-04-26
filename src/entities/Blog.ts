import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  OneToOne
} from "typeorm";
import { ObjectType, Field, ID, InputType, } from "type-graphql";
import { Length, MaxLength } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";
import { Picture } from "./Picture";

const today = new Date();

@Entity()
@ObjectType()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  @MaxLength(200)
  name: string;

  @Column()
  @Field({ nullable: true })
  @MaxLength(250)
  description?: string;

  
  @Column({ default: today })
  @Field(() => Date)
  created_at: Date;

  @Column({ default: today })
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: "CASCADE" })
  @Field(() => User)
  user: User;

  @OneToMany(() => Post, (post) => post.blog, { onDelete: "CASCADE" })
  @Field(() => [Post], { nullable: true })
  posts: Post[];

  
  @OneToOne(() => Picture, (picture) => picture.blog, { nullable: true })
  @Field(() => Picture, { nullable: true })
  picture: Picture;

}

@InputType()
export class BlogInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @Length(1, 500)
  description: string;

  // @Field({ nullable: true })
  // @MaxLength(250)
  // pictureId?: number;

  @Field({ nullable: true })
  userId: number;
}
