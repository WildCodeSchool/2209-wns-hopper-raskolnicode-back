import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql";
import datasource from "../utils";
import { Comment, CommentInput } from "../entities/Comment";

@Resolver()
export class CommentsResolver {
  
  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Arg("data", () => CommentInput) data: CommentInput
  ): Promise<Comment> {
    return await datasource.getRepository(Comment).save(data);
  }

  @Query(() => [Comment], { nullable: true })
  async getComments(): Promise<Comment[]> {
    const Comments = await datasource.getRepository(Comment).find({
      // relations: { user: true },
    });
    return Comments;
  }

}
