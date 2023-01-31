import { Resolver, Mutation, Arg, Query, ID, Authorized } from "type-graphql";
import datasource from "../utils";
import { Post, PostInput } from "../entities/Post";
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
    @Arg("title", { nullable: true }) title: string | null,
    @Arg("content", { nullable: true }) content: string | null,
    @Arg("image", { nullable: true }) image: string | null,
    @Arg("summary", { nullable: true }) summary: string | null,
    @Arg("isArchived", { nullable: true }) isArchived: boolean | null
  ): Promise<Post | null> {
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id } });

    if (post === null) {
      throw new Error('Il n\'y a pas de blog pour cette recherche')
    }

    if (title != null) {
      post.title = title;
    }

    if (content !== null) {
      post.content = content;
    }
    if (image !== null) {
      post.image = image;
    }
    if (summary !== null) {
      post.summary = summary;
    }
    if (isArchived !== null) {
      post.isArchived = isArchived;
    }

    return await datasource.getRepository(Post).save(post);
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({});
  }

  @Query(() => Post, { nullable: true })
  async getpost(@Arg("postId", () => ID) id: number): Promise<Post | null> {
    const post = await datasource.getRepository(Post).findOne({ where: { id } })

    if (post === null) {
      throw new Error('Il n\'y a pas d\'article pour cette recherche')
    }
    return post
  }
}
