import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length, MaxLength } from "class-validator";
import { User } from "./User";


@Entity()
@ObjectType()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field(() => ID)
  user_id: number;


  @Column({ unique: true })
  @Field()
  created_by: string;

  @Column()
  @Field()
  name: string;
  @Length(1, 50)


  @Column()
  @Field({ nullable: true })
  description?: string;
  @MaxLength(250)


  @Column()
  @Field()
  created_at: Date;

  @Column()
  @Field()
  updated_at: Date;


@ManyToOne(() => User, (user) => user.blog,  {
  onDelete: 'CASCADE',
})
user: User

}


@InputType()
export class BlogInput {

  @Column()
  @Field()
  name: string;
  @Length(1, 50)


  @Column()
  @Field()
  description: string;
  @Length(1, 500)

  @Column()
  @Field()
  updated_at: Date;
}


