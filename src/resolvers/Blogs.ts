import { Resolver, Mutation, Arg, Query, Authorized, ID } from "type-graphql";
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

   @Mutation(() => Blog, { nullable: true })
  async deleteBlog(@Arg("id", () => ID) id: number): Promise<Blog | null> {
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id } });

    if (blog === null) {
      return null;
    }

    return await datasource.getRepository(Blog).remove(blog);
  }
  
  @Authorized()
  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({ relations : { user: true } });
  }
}
