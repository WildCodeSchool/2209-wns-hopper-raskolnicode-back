import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash, verify } from "argon2";

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource.getRepository(User).save(data);
  }

  @Mutation(() => User, { nullable: true })
  async signIn(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User | null> {
    try {
      // because argon doesnt just hash, we can't get the user with its password
      // 1st step : search user by email
      const user = await datasource.getRepository(User)
        .findOne({ where: { email: data.email } })

      if (!user) {
        return null
      }

      // 2nd step : compare the user hashed password with the clear password
      if (await verify(user.password, data.password)) {
        return user
      } else {
        return null
      }
    } catch {
      return null
    }
    
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({});
  }
}
