import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsBoolean, Length } from "class-validator";
import { Comment } from "./Comment";
import { Blog } from "./Blog";

const today = new Date()

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field()
  summary: string;

  @Column()
  @Field()
  image: string;

  @Column()
  @Field()
  isArchived: boolean;

  @Column({default: today})
  @Field(() => Date)
  created_at: Date;

  @Column({default: today})
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => Comment, (comment) => comment.user, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @ManyToOne(() => Blog, (blog) => blog.posts, { nullable: false })
  @Field(() => Blog, { nullable: false })
  blog: Blog;


}



@InputType()
export class PostInput {

  @Field()
  @Length(1, 20)
  title: string;

  @Field()
  @Length(1, 20)
  content: string;

  @Field()
  @Length(1, 160)
  summary: string;

  @Field()
  image: string;

  @Field()
  @IsBoolean()
  isArchived: boolean;
}
