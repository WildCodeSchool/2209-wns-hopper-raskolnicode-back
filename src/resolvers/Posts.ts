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

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({});
  }
}
