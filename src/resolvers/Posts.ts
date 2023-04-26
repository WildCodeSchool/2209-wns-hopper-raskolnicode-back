import { Resolver, Mutation, Arg, Query, ID, Authorized, Ctx } from "type-graphql";
import datasource from "../utils";
import { Post, UpdatePostInput, PostInput } from "../entities/Post";
import { Blog } from "../entities/Blog";
import { IContext } from "./Users";

@Resolver()
export class PostsResolver {

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Arg("data", () => PostInput) data: PostInput,
    @Arg("blogId", () => ID) id: number
  ): Promise<Post> {
    const blog = await datasource.getRepository(Blog).findOne({ where: { id } });
    if (blog) {
      const post = { ...data, blog }
      return await datasource.getRepository(Post).save(post)
    }
  }

  @Authorized()
  @Mutation(() => Post, { nullable: true })
  async deletePost(@Arg("id", () => ID) id: number,
    @Ctx() context: IContext)
    : Promise<Post> {
    const user = context.user
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id }, relations: { blog: { user: true } } });
    if (post === null) {
      throw new Error('Il n\'y a pas de d\'article pour cette recherche')
    }

    if (user.id === post.blog.user.id) {
      return { ...(await post.remove()), id } as Post;
    } else {
      throw new Error('Vous n\'êtes pas l\'auteur de cette article')
    }

  }

  @Authorized()
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => UpdatePostInput) data: UpdatePostInput,
    @Ctx() context: IContext
  ): Promise<Post | null> {
    const user = context.user
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id }, relations: { blog: { user: true } } });

    if (post === null) {
      throw new Error('Il n\'y a pas de d\'article pour cette recherche')
    }

    if (user.id === post.blog.user.id) {
      return await datasource.getRepository(Post).save({ ...post, ...data, updated_at: new Date() });
    } else {
      throw new Error('Vous n\'êtes pas l\'auteur de cette article')
    }


  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({ relations: { comments: true, blog: true, picture: true } });
  }

  @Query(() => Post, { nullable: true })
  async getPost(@Arg("postId", () => ID) id: number): Promise<Post | null> {
    const post = await datasource.getRepository(Post).findOne({ where: { id }, relations: { comments: true, blog: true, picture: true } })
    if (post === null) {
      throw new Error('Il n\'y a pas d\'article pour cette recherche')
    }
    return post
  }
}
