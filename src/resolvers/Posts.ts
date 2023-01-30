import { Resolver, Mutation, Arg, Query, ID, Authorized} from "type-graphql";
import { User } from "../entities/User";
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
        const post = { ...data, blog}
        return await datasource.getRepository(Post).save(post)
      }
  }

  @Authorized()
   @Mutation(() => Post, { nullable: true })
    async deletePost(@Arg("id", () => ID) id: number): Promise<Post | void> {
    const post = await datasource
      .getRepository(Post)
      .findOne({ where: { id } });
    
    if (post === null) {
      throw new Error('Il n\'y a pas de d\'article pour cette recherche')
    }

    return await post.remove();
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({});
  }
}
