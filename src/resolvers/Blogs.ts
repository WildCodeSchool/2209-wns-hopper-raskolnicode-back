import { Resolver, Mutation, Arg, Query } from "type-graphql";
import datasource from "../utils";
import { Blog } from "../entities/Blog";

@Resolver()
export class BlogsResolver {
  @Mutation(() => Blog)
  async createPost(
    @Arg("data", () => Blog) data: Blog): Promise<Blog> {
    return await datasource.getRepository(Blog).save(data);
  }

  @Query(() => [Blog])
  async posts(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({});
  }
}
