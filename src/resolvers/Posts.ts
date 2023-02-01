import { Resolver, Mutation, Arg, Query, ID, Authorized } from "type-graphql";
import datasource from "../utils";
import { Post, UpdatePostInput,PostInput } from "../entities/Post";
import { Blog } from "../entities/Blog";

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
  async deletePost(@Arg("id", () => ID) id: number): Promise<Post> {
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id } });

    if (post === null) {
      throw new Error('Il n\'y a pas de d\'article pour cette recherche')
    }

    return await post.remove();
  }

  @Authorized()
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => UpdatePostInput) data: UpdatePostInput,
  ): Promise<Post | null> {
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id } });

    if (post === null) {
      throw new Error('Il n\'y a pas de d\'article pour cette recherche')
    }

    return await datasource.getRepository(Post).save({...post,...data,updated_at : new Date()});
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({ relations : { comments: true, blog:true } });
  }

  @Query(() => Post, { nullable: true })
  async getPost(@Arg("postId", () => ID) id: number): Promise<Post | null> {
    const post = await datasource.getRepository(Post).findOne({ where: { id }, relations : { comments: true, blog:true } })
    if (post === null) {
      throw new Error('Il n\'y a pas d\'article pour cette recherche')
    }
    return post
  }
}
