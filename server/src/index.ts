import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

require("dotenv").config();

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });


  let db_port = parseInt(process.env.db_port!);
  await createConnection({
    type: "postgres",
    host: process.env.db_host,
    port: db_port,
    username: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_database,
    entities: ["dist/entity/**/*.js"],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    synchronize: true,
    logging: true
  });

  const app = express();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
