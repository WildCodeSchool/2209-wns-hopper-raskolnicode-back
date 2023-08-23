import {
  Resolver,
  Query,
  Authorized,
  ObjectType,
  Field,
  Mutation,
  Arg,
  Ctx,
} from "type-graphql";
import { User } from "../entities/User";
import { IContext } from "./Users";
import datasource from "../utils";
import { Transaction } from "../entities/Transaction";
import { EntityManager, getDataSource, QueryRunner } from "typeorm";


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});



@ObjectType()
class PublicKey {
  @Field()
  publicKey: string;
}

@ObjectType()
class ClientSecret {
  @Field()
  clientSecret: string;
}

@ObjectType()
class Error {
  @Field()
  error: string;
}

@Resolver()
export class StripeResolver {
  @Query(() => PublicKey)
  async getStripePublicKey(): Promise<any> {
    console.log("******PUB KEY SRTIPE", process.env.STRIPE_PUBLISHABLE_KEY);
    return { publicKey: process.env.STRIPE_PUBLISHABLE_KEY };
  }

  @Authorized()
  @Query(() => ClientSecret || Error)
  async createPaymentIntent(): // @Arg("data", () => PictureInput) data: PictureInput,
  // @Ctx() context: IContext
  Promise<any> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "EUR",
        amount: 1,
        automatic_payment_methods: { enabled: true },
      });

      // Send publishable key and PaymentIntent details to client
      return { clientSecret: paymentIntent.client_secret };
    } catch (e) {
      return { error: e.message };
    }
  }

  @Authorized()
@Mutation(() => User, { nullable: true })
async becomePremium(
  @Arg("id") id: number,
  @Arg("paymentIntent") paymentIntent: string,
  @Ctx() context: IContext
): Promise<any> {
  const paymentIntentObj = JSON.parse(paymentIntent);
  console.log("paymentObj", paymentIntentObj);


  const user = context.user;

  const queryRunner = datasource.createQueryRunner();

  await queryRunner.connect();

  // Start a SERIALIZABLE transaction
  await queryRunner.startTransaction('SERIALIZABLE');

  try {
    const transaction = {
      stripeId: paymentIntentObj.id,
      amount: paymentIntentObj.amount,
      user,
    };

    await queryRunner.manager.getRepository(Transaction).save({ ...transaction, created_at: new Date() });
    const premiumUser = await queryRunner.manager.getRepository(User).save({ ...user, isPremium: true });

    // If everything is fine, commit the transaction
    await queryRunner.commitTransaction();

    return premiumUser;
  } catch (error) {
    // If there's an error, rollback any changes made in the transaction
    await queryRunner.rollbackTransaction();
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    // Ensure the query runner is released after the transaction completes
    await queryRunner.release();
  }
}
}
