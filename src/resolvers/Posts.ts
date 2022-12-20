import { Resolver, Mutation, Arg, Query } from "type-graphql";
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
}
