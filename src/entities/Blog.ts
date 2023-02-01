import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length, MaxLength } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";

const today = new Date()

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

  @Column({default: today})
  @Field(() => Date)
  created_at: Date;

  @Column({default: today})
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.blog,  { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User

  @OneToMany(() => Post, (post) => post.blog,  { onDelete: 'CASCADE' })
  @Field(() => [Post],{ nullable: false })
  posts: Post[]
}

@InputType()
export class BlogInput {

  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @Length(1, 500)
  description: string;

  // try userId with authorization decorator for role admin
}


