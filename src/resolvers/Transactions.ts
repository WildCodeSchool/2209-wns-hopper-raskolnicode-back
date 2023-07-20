import {
  Resolver,
  Query,
  Authorized,
} from "type-graphql";
import datasource from "../utils";
import { Transaction } from "../entities/Transaction";

@Resolver()
export class TransactionsResolver {

  @Authorized()
  @Query(() => [Transaction])
  async getTransactions(): Promise<Transaction[]> {
    return await datasource
      .getRepository(Transaction)
      .find();
  }
}
