import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: String
  }

  type RegisterResponse {
    message: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  input UpdateUserInput {
    id: ID!
    password: String
    role: String
  }

  input DeleteUserInput {
    id: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: DeleteUserInput!): User
  }
`;
