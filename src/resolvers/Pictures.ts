import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Picture, PictureInput, UpdatePictureInput } from "../entities/Picture";

@Resolver()
export class PictureResolver {
    @Query(() => [Picture])
    async pictures(): Promise<Picture[]> {
      return await Picture.find({ relations: ["post", "blog"] });
    }
  
    @Query(() => Picture, { nullable: true })
    async picture(@Arg("id") id: number): Promise<Picture | undefined> {
      return await Picture.findOne({ where: { id }, relations: ["post", "blog"] });
    }

  @Mutation(() => Picture)
  async createPicture(@Arg("data") data: PictureInput): Promise<Picture> {
    const picture = new Picture();
    picture.name = data.name;
    picture.link = data.link;
    await picture.save();
    return picture;
  }

  @Mutation(() => Picture, { nullable: true })
  async updatePicture(
    @Arg("id") id: number,
    @Arg("data") data: UpdatePictureInput
  ): Promise<Picture | null> {
    const picture = await Picture.findOne({ where: { id },  relations: ["post", "blog"] });

    if (!picture) {
      return null;
    }

    Object.assign(picture, data);
    await picture.save();
    return picture;
  }

  
  @Mutation(() => Boolean)
  async deletePicture(@Arg("id") id: number): Promise<boolean> {
    const picture = await Picture.findOne({ where: { id } });  
    if (!picture) {
      return false;
    }
  
    await picture.remove();
    return true;
  }
}
