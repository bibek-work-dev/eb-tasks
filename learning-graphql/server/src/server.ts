import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express4";
import connectToDB from "./dbConnect/dbConnect.js";
import { resolvers, typeDefs } from "./graphql/index.js";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const PORT = process.env.PORT;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await connectToDB();

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        console.log("here");
        return {
          req,
        };
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();

// import { ApolloServer } from "@apollo/server";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import { expressMiddleware } from "@as-integrations/express4";
// import express from "express";
// import http from "http";
// import cors from "cors";
// import { typeDefs } from "./graphql";
// import { resolvers } from "./graphql";

// const app = express();
// const httpServer = http.createServer(app);
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });
// await server.start();
// app.use(
//   "/graphql",
//   cors<cors.CorsRequest>(),
//   express.json(),
//   expressMiddleware(server, {
//     // context: async ({ req }) => ({ token: req.headers.token }),
//   })
// );

// await new Promise<void>((resolve) =>
//   httpServer.listen({ port: 4000 }, resolve)
// );
// console.log(`🚀 Server ready at http://localhost:4000/graphql`);
