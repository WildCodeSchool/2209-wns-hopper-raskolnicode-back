import { Entity, Column, PrimaryGeneratedColumn, OneToOne,  BaseEntity } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";
import { Blog } from "./Blog";
import { Post } from "./Post";


const today = new Date()

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  @Length(1, 50)
  name : string;

  @Column()
  @Field()
  link: string;

  @Column()
  @Field()
  user_id: string;

  @Column({default: today})
  @Field(() => Date)
  created_at: Date;

  @Column({default: today})
  @Field(() => Date)
  updated_at: Date;

  @OneToOne(() => Post, (post) => post.picture, { nullable: true, onDelete: 'CASCADE' })
  @Field(() => Post, { nullable: false })
  post: Post;

  @OneToOne(() => Blog, (blog) => blog.picture, { nullable: true, onDelete: 'CASCADE' })
  @Field(() => Blog, { nullable: false })
  blog: Blog;
}




@InputType()
export class PictureInput {

  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  link: string;
  
}

@InputType()
export class UpdatePictureInput {

    @Field()
    @Length(1, 50)
    name: string;
  
    @Field()
    link: string;
}