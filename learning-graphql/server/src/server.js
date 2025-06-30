"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const graphql_tag_1 = require("graphql-tag");
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const PORT = 3000;
let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
];
// Define Schemas (typeDefs)
const typeDefs = (0, graphql_tag_1.gql) `
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
        users: (parent, args, context, info) => {
            //   console.log("in users", parent, args, context, info);
            return users;
        },
        user: (parent, args, context, info) => {
            //   console.log("parent:", parent);
            //   console.log("args:", args);
            console.log("context:", context);
            //   console.log("info:", info);
            return users.find((user) => user.id == args.id);
        },
    },
    Mutation: {
        createUser: (_, { input }) => {
            const { name, email } = input;
            const newUser = {
                id: Number(users.length + 1),
                name,
                email,
            };
            users.push(newUser);
            return newUser;
        },
        updateUser: (_, { input }) => {
            const { id, name, email } = input;
            const user = users.find((u) => u.id === id);
            if (!user)
                return null;
            user.name = name;
            user.email = email;
            return user;
        },
        deleteUser: (_, { input }) => {
            const { id } = input;
            const toBeDeletedUser = users.find((each) => each.id == id);
            users = users.filter((each) => each.id != id);
            return toBeDeletedUser;
        },
    },
};
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = new server_1.ApolloServer({
            typeDefs,
            resolvers,
        });
        yield server.start();
        app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server));
        app.listen(PORT, () => {
            console.log(`Server ready at http://localhost:${PORT}/graphql`);
        });
    });
}
startServer();
