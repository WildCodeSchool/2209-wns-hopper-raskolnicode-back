import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash, verify } from "argon2";
import { sign, verify as jwtVerify } from "jsonwebtoken";


// Faire relation entre user et comment 
// Faire relation entre user et blog

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource.getRepository(User).save(data);
  }

  @Mutation(() => String, { nullable: true })
  async signIn(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<string | null> {
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

        // Jwt generation
        const token = sign({ userId: user.id }, process.env.JWT_SECRET_KEY)
        return token

      } else {
        return null
      }
    } catch {
      return null
    }
    
  }

  @Query(() => User, { nullable: true })
  async loggedUser(@Ctx() context: { token: string | null }): Promise<User | null> {
   
    const token = context.token
    
    if (token === null) {
      return null
    }
    
    const decodedToken: { userId: number } = jwtVerify(token, process.env.JWT_SECRET_KEY) as any
    const userId = decodedToken.userId

    const user = await datasource.getRepository(User).findOne({ where: { id: userId }})
    
    if (!user) {
      return null
    }
    
    return user
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({});
  }
  
}


