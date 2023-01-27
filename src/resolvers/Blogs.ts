import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";

@Resolver()
export class BlogsResolver {
  @Mutation(() => User)
  // protect @Authorize
  async createBlog(
    @Arg("data", () => BlogInput) data: BlogInput
    // find context of resolver
  ): Promise<Blog> {
    // get user id of logged user
    const user = await datasource.getRepository(User).findOne({ where: { id: data.user_id } });
    const blog = { ...data, user }
    if (user) {
      return await datasource.getRepository(Blog).save(blog)
    }
  }

  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({ relations : { user: true } });
  }
}
