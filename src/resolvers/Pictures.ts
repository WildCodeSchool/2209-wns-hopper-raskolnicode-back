import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Picture, PictureInput, UpdatePictureInput } from "../entities/Picture";
import datasource from "../utils";
import { IContext } from "./Users";

@Resolver()

export class PicturesResolver {

    @Query(() => [Picture])
    async getPictures(): Promise<Picture[]> {

        return await datasource.getRepository(Picture).find();
    }

    // const comment = await datasource
    // .getRepository(Comment)
    // .findOne({ where: { id }, relations: { user: true } });

    @Query(() => Picture, { nullable: true })
    async picture(@Arg("id") id: number): Promise<Picture | undefined> {
        return await Picture.findOne({ where: { id }, relations: ["post", "blog"] });
    }

    @Authorized()
    @Mutation(() => Picture)
    async createPicture(
        @Arg("data", () => PictureInput) data: PictureInput,
        @Ctx() context: IContext,

    ): Promise<Picture> {
        const user = context.user;
        if (user) {
            const picture = { ...data, user };
            return await datasource.getRepository(Picture).save(picture)
        }
    }


    @Authorized()
    @Mutation(() => Picture, { nullable: true })
    async updatePicture(
        @Arg("id") id: number,
        @Arg("data") data: UpdatePictureInput
    ): Promise<Picture | null> {
        const picture = await Picture.findOne({ where: { id }, relations: ["post", "blog"] });

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
