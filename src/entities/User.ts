import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { Comment } from "./Comment";
import { Blog } from "./Blog";
import { Picture } from "./Picture";


@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true })
  @Field()
  pseudo: string;

  @Column()
  @Field()
  password: string;

  @Column({ default: "USER" })
  @Field()
  role: string;

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Blog, (blog) => blog.user, { onDelete: "CASCADE" })
  @Field(() => [Blog], { nullable: true })
  blogs: Blog[];

  // @OneToMany(() => Picture, (picture) => picture.user, { nullable: true })
  // @Field(() => [Picture], { nullable: true })
  // pictures: Picture[];

}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 60)
  password: string;

  @Field({ nullable: true })
  pseudo: string;

  @Field({ nullable: true })
  role?: string;
}
