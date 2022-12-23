import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsBoolean, Length } from "class-validator";
import { Comment } from "./Comment";

@Entity()
@ObjectType()
export class Post {
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

  @Column()
  @Field()
  createdAt: Date;
  
  @Column()
  @Field()
  updatedAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.user, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

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

  @IsBoolean()
  isArchived: boolean;
}
