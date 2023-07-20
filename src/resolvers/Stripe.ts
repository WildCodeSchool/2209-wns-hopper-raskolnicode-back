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
        amount: 1999,
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

    console.log('paymentObj', paymentIntentObj)

    try {
      if (paymentIntentObj.client_secret.startsWith("pi")) {
        // security
        const user = context.user;
        if (user.id === id) {
  
          const transaction = {
            stripeId: paymentIntentObj.id,
            amount: paymentIntentObj.amount,
            user
          }
  
          await datasource.getRepository(Transaction).save({ ...transaction, created_at: new Date()})
  
          return await datasource
            .getRepository(User)
            .save({ ...user, isPremium: true });
        }
      }
    } catch (err) {
      console.log(err)
    }
  
  }
}
