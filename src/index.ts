import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { PostsResolver } from "./resolvers/Posts";
import { BlogsResolver} from "./resolvers/Blogs";

const PORT = 5000;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [UsersResolver, PostsResolver, BlogsResolver],
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    cors: true,
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);

  try {
    await datasource.initialize();
    console.log("Server started!");
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
