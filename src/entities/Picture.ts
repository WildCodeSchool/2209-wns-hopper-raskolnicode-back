import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";
import { User } from "./User";

const today = new Date();

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  @Length(1, 50)
  name: string;

  @Column()
  @Field()
  link: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @Column({ default: today })
  @Field(() => Date)
  created_at: Date;

  @Column({ default: today })
  @Field(() => Date)
  updated_at: Date;
}

@InputType()
export class PictureInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  link: string;
}
