import { Resolver, Mutation, Arg, Query,ID } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Post, PostInput } from "../entities/Post";

@Resolver()
export class PostsResolver {
  @Mutation(() => User)
  async createPost(
    @Arg("data", () => PostInput) data: PostInput
  ): Promise<Post> {
    return await datasource.getRepository(Post).save(data);
  }

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find({});
  }

  
  @Query(() => Post, { nullable: true })
  async post(@Arg("PostId", () => ID) id: number): Promise<Post | null> {
    const post = await datasource.getRepository(Post).findOne({ where: { id }})

    if (post === null) {
      throw new Error('Il n\'y a pas d\'article pour cette recherche')
    }
    return post
  }
}
