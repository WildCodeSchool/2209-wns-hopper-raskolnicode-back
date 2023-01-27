import { AuthChecker } from 'type-graphql'
import datasource from "./utils";
import { verify as jwtVerify } from "jsonwebtoken";
import { User } from "./entities/User";
import { IContext } from './resolvers/Users';

export const customAuthChecker: AuthChecker<IContext> = async (
  { root, args, context, info }, roles,
) => {

  const token = context.token

  if (token === null || token === '') {
    return false
  }

  try {
    const decodedToken: { userId: number } = jwtVerify(token, process.env.JWT_SECRET_KEY) as any
    const userId = decodedToken.userId

    const user = await datasource.getRepository(User).findOne({ where: { id: userId } })

    if (!user) {
      return false
    }

    context.user = user
    console.log('context user', user)
    return true
  } catch {
    return false
  }

};