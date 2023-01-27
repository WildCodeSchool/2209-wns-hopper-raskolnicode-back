import { AuthChecker } from 'type-graphql'
import datasource from "./utils";
import { verify as jwtVerify } from "jsonwebtoken";
import { User } from "./entities/User";
import { IContext } from './resolvers/Users';

export const customAuthChecker: AuthChecker<IContext> = async (
  { root, args, context, info }, roles,
) => {
  console.log('executing auth checker')
  const token = context.token
  console.log('TOKEN in auth', token)

  if (token === null || token === '') {
    context.user = null
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
    context.user = null
    return false
  }

};