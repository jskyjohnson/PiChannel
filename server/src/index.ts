import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./typeDefs";
//import { resolvers } from "./resolver/UserResolvers";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver/UserResolver";
import { BoardResolver } from "./resolver/BoardResolver";
import { PostResolver } from "./resolver/PostResolver";
import { ThreadResolver } from "./resolver/ThreadResolver";

require("dotenv").config();

const startServer = async () => {
  const app = express();
  app.set("proxy", 1);

  let db_port = parseInt(process.env.db_port!);
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["dist/entity/**/*.js"],
    migrations: ["dist/migration/**/*.js"],
    //subscribers: ["dist/subscriber/**/*.js"],
    //synchronize: true,
    logging: true,
  });
  await conn.runMigrations();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, BoardResolver, PostResolver, ThreadResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    playground: true,
  });

  server.applyMiddleware({ app, cors: { origin: "*", credentials: true } });

  const PORT = process.env.PORT || 4000;

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at ${server.graphqlPath}`)
  );
};

startServer().catch((err) => {
  console.error(err);
});
