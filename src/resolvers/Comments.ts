import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
import { Comment } from "../entities/Comment";

@Resolver()
export class CommentsResolver {
  @Mutation(() => Comment)
  async createPost(
    @Arg("data", () => Comment) data: Comment
  ): Promise<Comment> {
    return await datasource.getRepository(Comment).save(data);
  }

  @Query(() => [Comment])
  async posts(): Promise<Comment[]> {
    return await datasource.getRepository(Comment).find({});
  }
}
