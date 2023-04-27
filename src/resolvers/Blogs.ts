import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Authorized,
  ID,
  Ctx,
} from "type-graphql";
import datasource from "../utils";
import { Blog, BlogInput } from "../entities/Blog";
import { IContext } from "./Users";
import { User } from "../entities/User";
import { Picture } from "../entities/Picture";

@Resolver()
export class BlogsResolver {
  @Authorized()
  @Mutation(() => Blog)
  async createBlog(
    @Arg("data", () => BlogInput) data: BlogInput,
    @Ctx() context: IContext
  ): Promise<Blog> {
    const user = context.user;
    if (user) {
      let picture;
      if (data.picture_link) {
        picture = new Picture();
        picture.link = data.picture_link;
        picture.name = data.picture_name;
        picture.user = user;
        await datasource.getRepository(Picture).save(picture);
      }

      const blog = { ...data, user, picture };
      return await datasource.getRepository(Blog).save(blog);
    }
  }

  @Mutation(() => Blog)
  async createBlogByUser(
    @Arg("data", () => BlogInput) data: BlogInput
  ): Promise<Blog> {
    const user = await datasource
      .getRepository(User)
      .findOne({ where: { id: data.userId } });
    if (user) {
      const blog = { ...data, user };
      return await datasource.getRepository(Blog).save(blog);
    }
  }

  @Authorized()
  @Mutation(() => Blog, { nullable: true })
  async deleteBlog(
    @Arg("id", () => ID) id: number,
    @Ctx() context: IContext
  ): Promise<Blog> {
    const user = context.user;
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id }, relations: { user: true } });
    if (blog === null) {
      throw new Error("Il n'y a pas de blog pour cette recherche");
    }
    if (user.id === blog.user.id) {
      return await blog.remove();
    } else {
      throw new Error("Vous n'êtes pas l'auteur de ce blog");
    }
  }

  @Authorized()
  @Mutation(() => Blog, { nullable: true })
  async updateBlog(
    @Arg("id", () => ID) id: number,
    @Arg("name", { nullable: true }) name: string | null,
    @Arg("description", { nullable: true }) description: string | null,
    @Arg("picture_link", { nullable: true }) pictureLink: string | null,
    @Arg("picture_name", { nullable: true }) pictureName: string | null,
    @Ctx() context: IContext
  ): Promise<Blog | null> {
    const user = context.user;
    const blog = await datasource
      .getRepository(Blog)
      .findOne({ where: { id }, relations: { user: true } });

    blog.updated_at = new Date();

    if (blog === null) {
      throw new Error("Il n'y a pas de blog pour cette recherche");
    }

    if (name != null) {
      blog.name = name;
    }

    if (description !== null) {
      blog.description = description;
    }

    if (pictureLink !== null) {
      blog.picture.link = pictureLink;
    }

    if (pictureName !== null) {
      blog.picture.name = pictureName;
    }

    if (user.id === blog.user.id) {
      return await datasource.getRepository(Blog).save(blog);
    } else {
      throw new Error("Vous n'êtes pas l'auteur de ce blog");
    }
  }

  @Query(() => Blog, { nullable: true })
  async getBlog(@Arg("id", () => ID) id: number): Promise<Blog | null> {
    const blog = await datasource.getRepository(Blog).findOne({
      where: { id },
      relations: { user: true, posts: true, picture: true },
    });

    if (blog === null) {
      throw new Error("Il n'y a pas de blog pour cette recherche");
    }
    return blog;
  }

  @Query(() => [Blog])
  async getBlogs(): Promise<Blog[]> {
    return await datasource.getRepository(Blog).find({
      relations: { user: true, posts: true, picture: { user: true } },
    });
  }
}
