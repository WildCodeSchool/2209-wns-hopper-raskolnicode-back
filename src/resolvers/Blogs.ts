import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";
import { IContext } from "./Users";
import { Ctx } from "type-graphql";

@Resolver()
export class BlogsResolver {
  @Authorized()
  @Mutation(() => User)
  async createBlog(
    @Arg("data", () => BlogInput) data: BlogInput,
    @Ctx() context: IContext
  ): Promise<Blog> {
    const user = context.user
    if (user) {
      const blog = { ...data, user }
      return await datasource.getRepository(Blog).save(blog)
    }
  }
  
  @Authorized()
  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({ relations : { user: true } });
  }
}
