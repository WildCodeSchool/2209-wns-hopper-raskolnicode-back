import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";

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
  @Length(1, 50)

  @Column()
  @Field()
  text: string;
  @Length(1, 1500)

  @Column()
  @Field()
  created_at: Date;

  @Column({ unique: true })
  @Field()
  created_by: string;

} 
