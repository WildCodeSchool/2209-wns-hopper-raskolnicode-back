import { Resolver, Mutation, Arg, Query, Authorized, ID } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";
import { IContext } from "./Users";
import { Ctx } from "type-graphql";

@Resolver()
export class BlogsResolver {
  @Authorized()
  @Mutation(() => Blog)
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
   @Mutation(() => Blog, { nullable: true })
    async deleteBlog(@Arg("id", () => ID) id: number): Promise<Blog | void> {
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id } });
    
    if (blog === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }

    return await blog.remove();
  }

  @Authorized()
  @Mutation(() => Blog, { nullable: true })
  async updateBlog(
    @Arg("id", () => ID) id: number,
    @Arg("name", { nullable: true }) name: string | null,
    @Arg("description", { nullable: true }) description: string | null
  ): Promise<Blog | null> {
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id } });

    blog.created_at = new Date()

    if (blog === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }

    if (name != null) {
      blog.name = name;
    }

    if (description !== null) {
      blog.description = description;
    }

    return await datasource.getRepository(Blog).save(blog);
  }


  @Query(() => Blog, { nullable: true })
  async blog(@Arg("id", () => ID) id: number): Promise<Blog | null> {
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id }});

    if (blog === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }
    return blog
  }
  
  @Query(() => [Blog])
  async blogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({ relations : { user: true , posts: true} });
  }
}
