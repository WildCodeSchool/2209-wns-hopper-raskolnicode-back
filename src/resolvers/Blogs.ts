import { Resolver, Mutation, Arg, Query, Authorized, ID, Ctx } from "type-graphql";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";
import { IContext } from "./Users";
import { User } from "../entities/User";

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

  @Mutation(() => Blog)
  async createBlogByUser(
    @Arg("data", () => BlogInput) data: BlogInput
  ): Promise<Blog> {
    const user = await datasource.getRepository(User).findOne({ where: { id: data.userId}})
    if (user) {
      const blog = { ...data, user }
      return await datasource.getRepository(Blog).save(blog)
    }
  }

  @Authorized()
   @Mutation(() => Blog, { nullable: true })
    async deleteBlog(
    @Arg("id", () => ID) id: number,
    @Ctx() context: IContext)
    : Promise<Blog> {
    const user  = context.user
    const blog = await datasource
    .getRepository(Blog)
    .findOne({ where: { id }, relations : { user : true} });
    if (blog === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }
    if(user.id == blog.user.id){
      return await blog.remove()
    }else{
      throw new Error('Vous n\'êtes pas l\'auteur de ce blog')
    }
  }

  @Authorized()
  @Mutation(() => Blog, { nullable: true })
  async updateBlog(
    @Arg("id", () => ID) id: number,
    @Arg("name", { nullable: true }) name: string | null,
    @Arg("description", { nullable: true }) description: string | null,
    @Ctx() context: IContext
  ): Promise<Blog | null> {
    const user  = context.user
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id } , relations : { user : true} });

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

    if(user.id == blog.user.id){
      return await datasource.getRepository(Blog).save(blog);
    }else{
      throw new Error('Vous n\'êtes pas l\'auteur de ce blog')
    }
  }

  @Query(() => Blog, { nullable: true })
  async getBlog(@Arg("id", () => ID) id: number): Promise<Blog | null> {
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id },relations : { user: true , posts: true}});

    if (blog === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }
    return blog
  }
  
  @Query(() => [Blog])
  async getBlogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({ relations : { user: true , posts: true} });
  }
}
