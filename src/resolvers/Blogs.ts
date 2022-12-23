import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";

@Resolver()
export class BlogsResolver {
  @Mutation(() => User)
  async createBlog(
    @Arg("data", () => BlogInput) data: BlogInput
    ): Promise<Blog> {
    return await datasource.getRepository(Blog).save(data);
  }

  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({});
  }
}
