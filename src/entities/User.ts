import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { Comment } from "./Comment";
import { Blog } from "./Blog";
import { Transaction } from "./Transaction";

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

  @Column({ default: false })
  @Field()
  isPremium: boolean;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[]
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
