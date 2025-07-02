import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express4";
import connectToDB from "./dbConnect/dbConnect.js";
import { resolvers, typeDefs } from "./graphql/index.js";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { verifyJwt } from "./utils/jwt.js";
import { GraphQLError } from "graphql";

export type TypeAuthUser = {
  _id: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type TypeMyContext = {
  user: TypeAuthUser | null;
  req: Request;
};

const PORT = process.env.PORT || 3000;
// console.log("process.env", process.env.MONGO_URI);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<TypeMyContext>({
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
    expressMiddleware<TypeMyContext>(server, {
      context: async ({ req }): Promise<TypeMyContext> => {
        console.log("here");
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

        const user = token ? verifyJwt(token) : null;
        return {
          user,
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
