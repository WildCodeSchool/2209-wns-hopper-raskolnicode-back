import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, OneToMany, OneToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsBoolean, Length } from "class-validator";
import { Comment } from "./Comment";
import { Blog } from "./Blog";
import { Picture } from "./Picture";


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
  isArchived: boolean;

  @Column({default: today})
  @Field(() => Date)
  created_at: Date;

  @Column({default: today})
  @Field(() => Date)
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true , onDelete: 'CASCADE' })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @ManyToOne(() => Blog, (blog) => blog.posts, { nullable: false , onDelete: 'CASCADE' })
  @Field(() => Blog, { nullable: false })
  blog: Blog;


  @ManyToOne(() => Picture, { nullable: true, onDelete: 'CASCADE' })
  @Field(() => Picture, { nullable: true })
  picture: Picture;


  // @ManyToOne(() => Picture, (picture) => picture.posts, { nullable: true })
  // @Field(() => Picture, { nullable: true })
  // picture: Picture;

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
  pictureId?: number;

  @Field()
  @IsBoolean()
  isArchived: boolean;
}


@InputType()
export class UpdatePostInput {

  @Field({ nullable: true })
  @Length(1, 20)
  title: string;

  @Field({ nullable: true })
  @Length(1, 20)
  content: string;

  @Field({ nullable: true })
  @Length(1, 160)
  summary: string;

  @Field({ nullable: true })
  pictureId?: number;

  @Field({ nullable: true })
  @IsBoolean()
  isArchived: boolean;
}