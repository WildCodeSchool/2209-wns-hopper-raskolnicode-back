import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  ID,
} from "type-graphql";
import { Picture, PictureInput } from "../entities/Picture";
import datasource from "../utils";
import { IContext } from "./Users";

@Resolver()
export class PicturesResolver {
  @Query(() => [Picture])
  async getPictures(): Promise<Picture[]> {
    return await datasource
      .getRepository(Picture)
      .find({ relations: { user: true } });
  }

  @Authorized()
  @Mutation(() => Picture)
  async createPicture(
    @Arg("data", () => PictureInput) data: PictureInput,
    @Ctx() context: IContext
  ): Promise<Picture> {
    const user = context.user;
    if (user) {
      const picture = { ...data, user };
      return await datasource.getRepository(Picture).save(picture);
    }
  }

  @Authorized()
  @Mutation(() => Picture, { nullable: true })
  async updatePicture(
    @Arg("id", () => ID) id: number,
    @Arg("name", { nullable: true }) name: string | null,
    @Arg("link", { nullable: true }) link: string | null,
    @Ctx() context: IContext
  ): Promise<Picture | null> {
    const user = context.user;
    const picture = await datasource
      .getRepository(Picture)
      .findOne({ where: { id }, relations: { user: true } });

    picture.updated_at = new Date();

    if (picture === null) {
      throw new Error("Il n'y a pas de photo pour cette recherche");
    }

    if (name != null) {
      picture.name = name;
    }

    if (link !== null) {
      picture.link = link;
    }

    if (user.id === picture.user.id) {
      return await datasource.getRepository(Picture).save(picture);
    } else {
      throw new Error("Vous n'êtes pas à l'origine de cette photo");
    }
  }

  @Authorized()
  @Mutation(() => Picture, { nullable: true })
  async deletePicture(
    @Arg("id", () => ID) id: number,
    @Ctx() context: IContext
  ): Promise<Picture> {
    const user = context.user;
    const picture = await datasource
      .getRepository(Picture)
      .findOne({ where: { id }, relations: { user: true } });
    if (picture === null) {
      throw new Error("Il n'y a pas de photo pour cette recherche");
    }
    if (user.id === picture.user.id) {
      return await picture.remove();
    } else {
      throw new Error("Vous n'êtes pas à l'origine de cette photo");
    }
  }
}
