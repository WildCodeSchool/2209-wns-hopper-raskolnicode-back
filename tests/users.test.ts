import { beforeAll, describe, expect, it } from '@jest/globals'
import { buildSchema } from "type-graphql";
import { UsersResolver } from '../src/resolvers/Users';
import { PostsResolver } from '../src/resolvers/Posts';
import { BlogsResolver } from '../src/resolvers/Blogs';
import { CommentsResolver } from '../src/resolvers/Comments';
import { customAuthChecker } from '../src/auth';
import { GraphQLSchema, graphql, print } from 'graphql';
import datasource from '../src/utils';
import { createUser } from './gaphql/createUser';
import { User } from '../src/entities/User';

let schema: GraphQLSchema
// code to execute before all tests (beforeEAch is available as well)

beforeAll(async () => {
  await datasource.initialize()
  // purge db
  try {
    const entities = datasource.entityMetadatas; // get all entities
    const tableNames = entities.map(entity => `"${entity.tableName}"`).join(", "); // string of all entities seperated by comma
    await datasource.query(`TRUNCATE ${tableNames} CASCADE;`); // delete all lines of db, with CASCADE opt which deletes all relations
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${JSON.stringify(error)}`)
  }
  // build schema
  schema = await buildSchema({
    resolvers: [UsersResolver, PostsResolver, BlogsResolver, CommentsResolver],
    authChecker: customAuthChecker
  });
})

describe('users', () => { 

  describe('user signup', () => {
    it('creates a new user', async () => {

      const result = await graphql({ 
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "test@mail.com",
            pseudo: "test",
            password: "test1234"
          }
        }
      })
      
      console.log('result', result)
    
      expect(result.data?.createUser).toBeTruthy();
    });

    it('creates user in db', async () => {
      const user = await datasource.getRepository(User).findOneBy({email: 'test@mail.com'});
      expect(user).toBeDefined();
    });

    it('cannot create 2 users with the same email', async () => {
      const result = await graphql({ 
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "test@mail.com",
            pseudo: "test",
            password: "test1234"
          }
        }
      })
      
      console.log('result', result)
    
      expect(result.data?.createUser).toBeFalsy();
      expect(result.errors).toHaveLength(1)
    })
  })

 })