import { Resolver, Mutation, Arg, Query, Authorized,Ctx,ID } from "type-graphql";
import datasource from "../utils";
import { Comment, CommentInput } from "../entities/Comment";
import { IContext } from "./Users";
import { User } from "../entities/User"
import { Post } from "../entities/Post";

@Resolver()
export class CommentsResolver {

  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Arg("data", () => CommentInput) data: CommentInput,
    @Arg("postId", () => ID) id: number,
    @Ctx() context: IContext
  ): Promise<Comment> {
    const user : User = context.user
    const post : Post = await datasource.getRepository(Post).findOne({ where: { id }, relations : { comments: true } })
    if (user) {
      const comment = { ...data,user,post}
      return await datasource.getRepository(Comment).save(comment)
    }
  }

  @Authorized()
  @Mutation(() => Comment, { nullable: true })
  async updateComment(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => CommentInput) data: CommentInput,
  ): Promise<Comment | null> {
    const comment = await datasource
      .getRepository(Comment)
      .findOne({ where: { id } });

    if (comment === null) {
      throw new Error('Ce commentaire n\'existe pas')
    }
    return await datasource.getRepository(Comment).save({...comment,...data});
  }

  @Query(() => [Comment], { nullable: true })
  async getComments(): Promise<Comment[]> {
    const Comments = await datasource.getRepository(Comment).find({
      relations: { user: true , post:true},
    });
    return Comments;
  }

  @Query(() => [Comment], { nullable: true })
  async getCommentsByPost(
    @Arg("postId", () => ID) id: number,
  ): Promise<Comment[]> {
    const post : Post = await datasource.getRepository(Post).findOne({ where : { id } });
    if(post){
     return await datasource.getRepository(Comment).find({relations: { user: true , post:true} , where : { post : { id : post.id } } });
    }
  }
}
