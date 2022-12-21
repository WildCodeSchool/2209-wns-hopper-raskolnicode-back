import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";

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
  @Field()
  description: string;
  @Length(1, 500)


  @Column()
  @Field()
  created_at: Date;

  @Column()
  @Field()
  updated_at: Date;
} 


