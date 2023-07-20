import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

const today = new Date();

@Entity()
@ObjectType()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  stripeId: string;

  @Column()
  @Field()
  amount: number;

  @Column({ default: today })
  @Field(() => Date)
  created_at: Date;

  @ManyToOne(() => User, user => user.transactions, { cascade: true })
  @Field(() => User)
  user: User;

}