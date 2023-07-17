import { Resolver, Query, Authorized, ObjectType, Field } from "type-graphql";

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
    console.log('******PUB KEY SRTIPE', process.env.STRIPE_PUBLISHABLE_KEY)
    return { publicKey: process.env.STRIPE_PUBLISHABLE_KEY };
  }

  @Authorized()
  @Query(() => ClientSecret || Error)
  async createPaymentIntent(
    // @Arg("data", () => PictureInput) data: PictureInput,
    // @Ctx() context: IContext
  ): Promise<any> {
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
}
