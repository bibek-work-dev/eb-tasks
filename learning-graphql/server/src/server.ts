import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";
const PORT = 3000;

type CreateUserInput = Omit<TypeUser, "id">;
type UpdateUserInput = TypeUser;
type DeleteUserInput = Pick<TypeUser, "id">;

type TypeUser = {
  id: number;
  name: string;
  email: string;
};
let users: TypeUser[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

// Define Schemas (typeDefs)
const typeDefs = gql`
  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String!
    email: String!
  }

  input DeleteUserInput {
    id: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: DeleteUserInput!): User
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello From GraphQL",
    users: (parent: ParentNode, args: any, context: any, info: any) => {
      //   console.log("in users", parent, args, context, info);
      return users;
    },
    user: (parent: ParentNode, args: any, context: any, info: any) => {
      //   console.log("parent:", parent);
      //   console.log("args:", args);
      console.log("context:", context);
      //   console.log("info:", info);
      return users.find((user) => user.id == args.id);
    },
  },
  Mutation: {
    createUser: (_: unknown, { input }: { input: CreateUserInput }) => {
      const { name, email } = input;
      const newUser = {
        id: Number(users.length + 1),
        name,
        email,
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_: unknown, { input }: { input: UpdateUserInput }) => {
      const { id, name, email } = input;
      const user = users.find((u) => u.id === id);
      if (!user) return null;

      user.name = name;
      user.email = email;

      return user;
    },
    deleteUser: (_: unknown, { input }: { input: DeleteUserInput }) => {
      const { id } = input;
      const toBeDeletedUser = users.find((each) => each.id == id);
      users = users.filter((each) => each.id != id);
      return toBeDeletedUser;
    },
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
